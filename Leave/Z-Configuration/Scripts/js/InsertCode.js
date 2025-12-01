module.exports = async ({ app, quickAddApi }) => {
  const leaf = app.workspace.activeLeaf;
  if (!leaf || !leaf.view || leaf.view.getViewType() !== "markdown") {
    console.log("No active markdown editor.");
    return;
  }
  const editor = leaf.view.editor;

  // 1) 获取当前行与光标
  const cursor = editor.getCursor();
  const curLine = editor.getLine(cursor.line) ?? "";

  // 2) 解析缩进与前缀
  const leadingSpaces = (curLine.match(/^\s*/) || [""])[0];
  const gtPrefixMatch = curLine.match(/^(\s*(>\s*)*)/); 
  const gtPrefix = gtPrefixMatch ? gtPrefixMatch[1] : "";

  const listRe = /^\s*([-+*]|\d+\.)\s/;
  let listIndent = "";
  if (listRe.test(curLine)) {
    listIndent = " ".repeat(4); // 列表嵌套，额外+4空格
  }

  // 最终前缀
  const finalPrefix = leadingSpaces + gtPrefix + listIndent;

  // 3) 用户选择代码语言 & 输入内容
  const codeTypes = ["prompt","markdown","text","js","ts","python","bash","json","yaml"];
  const codeType = await quickAddApi.suggester(codeTypes, codeTypes) ?? "text";

  const codeContentRaw =
    (await quickAddApi.wideInputPrompt(
      "请输入代码内容（支持多层嵌套，换行保留，可留空）",
      "在此输入或粘贴...",
      ""
    )) || "";

  // 4) 拼接代码块内容（每行带上前缀）
  const codeLines = codeContentRaw.split("\n");
  const codeBody = codeContentRaw
    ? codeLines.map(l => `${finalPrefix}> ${l}`).join("\n") + "\n"
    : "";

  const block =
`${finalPrefix}> \`\`\`${codeType}
${codeBody}${finalPrefix}> \`\`\``;

  // 5) 插入到当前位置
  const needLeadingNewline = (curLine.trim().length > 0 && cursor.ch !== 0);
  editor.replaceSelection((needLeadingNewline ? "\n" : "") + block);
};

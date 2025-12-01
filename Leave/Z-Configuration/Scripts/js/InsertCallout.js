module.exports = async ({ app, quickAddApi }) => {
  // 1) 取 Editor（修正 activeEditor 的问题）
  const leaf = app.workspace.activeLeaf;
  if (!leaf || !leaf.view || leaf.view.getViewType() !== "markdown") {
    console.log("No active markdown editor.");
    return;
  }
  const editor = leaf.view.editor;

  // 2) 光标与当前行
  const cursor = editor.getCursor();
  const curLine = editor.getLine(cursor.line) ?? "";
  const curLeading = (curLine.match(/^\s*/) || [""])[0].length;

  // 3) 判断是否处在列表上下文
  const listRe = /^\s*([-+*]|\d+\.)\s/;
  let isListContext = listRe.test(curLine);
  let listLeading = curLeading;

  if (!isListContext && curLine.trim() === "" && cursor.line > 0) {
    const prevLine = editor.getLine(cursor.line - 1) ?? "";
    if (listRe.test(prevLine)) {
      isListContext = true;
      listLeading = (prevLine.match(/^\s*/) || [""])[0].length;
    }
  }

  // 4) 交互：选择 callout / 标题 / 代码类型 / 内容
  const calloutTypes = ["note","tip","info","warning","danger","example","abstract","todo","faq"];
  const codeTypes = ["prompt","markdown","text","js","ts","python","bash","json","yaml"];

  const callout = await quickAddApi.suggester(calloutTypes, calloutTypes) ?? "note";

  const titleInput = await quickAddApi.inputPrompt("Callout 标题（可空）");
  const title = titleInput ? `- ${titleInput}` : "";

  const codeType = await quickAddApi.suggester(codeTypes, codeTypes) ?? "prompt";

  // ✅ 使用多行输入对话框（支持粘贴并保留换行）
  // 如果想默认填入剪贴板内容，把第三个参数从 "" 改成：
  // await quickAddApi.utility.getClipboard();  // 需要 QuickAdd 1.8.x+，见文档 Utility.getClipboard
  const codeContentRaw =
    (await quickAddApi.wideInputPrompt(
      "请输入代码内容（支持多行输入或粘贴，可留空）",
      "在此输入或粘贴...",
      "" // 默认值；如需预填剪贴板，替换为 await quickAddApi.utility.getClipboard()
    )) || "";

  // 5) 计算缩进
  const indentSpaces = isListContext ? listLeading + 4 : curLeading;
  const indent = " ".repeat(indentSpaces);

  // 6) 处理代码内容
  const codeLines = codeContentRaw.split("\n");
  const codeBody = codeContentRaw
    ? codeLines.map(l => `${indent}> ${l}`).join("\n") + "\n"
    : "";

  // 7) 拼接输出（标题可空 + 去掉多余换行）
  const block =
`${indent}> [!${callout}]${title}
${indent}> \`\`\`${codeType}
${codeBody}${indent}> \`\`\``;

  const needLeadingNewline = (curLine.trim().length > 0 && cursor.ch !== 0);
  editor.replaceSelection((needLeadingNewline ? "\n" : "") + block);
};



## 问题描述
- 一个电脑项配置两个GitHub账户，一个账户是cdongt，对应邮箱是 cdongt@163.com；
- 另一个账户是muwinter，对应邮箱是 2124413584@qq.com 。
- 各自都有远程仓库，想要拉取远程仓库，并绑定对应账户，并用对应账号进行git操作。


## 任务目标

1.拉取cdongt账户的远程私人仓库neetcode75 地址是：(https://github.com/cdongt/neetcode75)
  - 本地创建一个与远程仓库同名的文件夹，并将远程仓库中的所有文件和目录都下载到该文件夹中。存放在：D:\Git_Repo
  - 保证本地的neetcode75仓库与cdongt账户绑定，之后都是用cdongt账户进行git操作
  - 保证muwinter不能操作neetcode75仓库，只能通过cdongt账户操作

<br>



## 配置过程
### 步骤一：配置两个GitHub账户

#### 1. 生成SSH密钥对

>[!warning]+ 以下命令都使用CMD命令行


- 用户目录下创建.ssh文件夹
```
mkdir -p %USERPROFILE%\.ssh
```


##### 1.1 为cdongt账户生成密钥



```sh
ssh-keygen -t rsa -C "cdongt@163.com" -f %USERPROFILE%\.ssh\cdongt_rsa

```

##### 1.2 为muwinter账户生成密钥
```sh
ssh-keygen -t rsa -C "2124413584@qq.com" -f C:\Users\cdong\.ssh\muwinter_rsa
```

#### 2. 配置SSH Agent

>[!green]+ 此条命令使用Git Bash

- 打开**Git Bash**，确保SSH Agent正在运行：
```sh
eval "$(ssh-agent -s)"
```



- 添加密钥到SSH Agent：
```sh

ssh-add ~/.ssh/cdongt_rsa
ssh-add ~/.ssh/muwinter_rsa

```

#### 3. 编辑SSH配置文件

在用户目录下（类似：C:\Users\cdong\.ssh），以vscode打开，并新建config
>[!warning]+ config是全部，无后缀

粘贴以下内容并保存：
```sh
# cdongt account

Host github.com-cdongt

  HostName github.com

  User git

  IdentityFile ~/.ssh/cdongt_rsa

  

# muwinter account

Host github.com-muwinter

  HostName github.com

  User git

  IdentityFile ~/.ssh/muwinter_rsa
```

#### 4. 将SSH公钥添加到GitHub

##### 4.1 登录cdongt账户
登录github账号后，前往[此网址](https://github.com/settings/keys)，点击“New SSH key”。
输入标题（如“cdongt’s laptop”），粘贴%USERPROFILE%\.ssh\cdongt_rsa.pub的内容。
点击“Add SSH key”。

#### 4.2 登录muwinter账户
前往https://github.com/settings/keys，点击“New SSH key”。
输入标题（如“muwinter’s laptop”），粘贴%USERPROFILE%\.ssh\muwinter_rsa.pub的内容。
点击“Add SSH key”。

<br>

---

### 步骤二：拉取远程仓库并绑定账户（方法一）

#### 1. 拉取cdongt账户的远程仓库

##### 1.1 先在github上创建仓库（如果已有仓库，略过此步骤）

##### 1.2 克隆仓库
###### 方法1：用 SSH 的方法

1.  先定位到要克隆仓库的本地文件夹中
2. 用命令克隆仓库
```sh
git clone git@github.com-cdongt:cdongt/neetcode75.git . # 这是SSH
```


###### 方法2：用 HTTPS 的方法

1.  先定位到要克隆仓库的本地文件夹中
2. 用命令克隆
```sh
git clone https://github.com/cdongt/EXAM.git # 这是HTTPS
```



#### 2. 设置本地仓库的用户配置
在仓库根目录下，设置user.name和user.email为cdongt账户的配置，使用--local选项：
```sh
git config --local user.name "cdongt"
git config --local user.email "cdongt@163.com"

##顺便记一下 muwinter的
git config --local user.name "muwinter"
git config --local user.email "2124413584@qq.com"
```


#### 3. 设置推送权限（SSH方法忽略）
- 推送时需要输入用户名和密码（或个人访问令牌），验证通过后才能推送。

### 步骤二：本地仓库推送到远程仓库（方法二）

####  本地仓库和远程仓库绑定

将本地文件夹直接推送到cdongt账户的github变成新的仓库，并且与cdongt账户绑定

```sh
   git init

   git config --local user.name "cdongt"
   git config --local user.email "cdongt@163.com"

   git remote add origin git@github.com-cdongt:cdongt/ob_repo_sync.git
   # @后面是config 文件中的Host
   git add .
   git commit -m "Initial commit"
   git push -u origin main

```

### 特别注意

##### 出现 erro ：fatal: detected dubious ownership in repository at 'D:/Git_Repo/neetcode75'
- 错误原因：错误信息再次指出Git检测到仓库目录的所有权存在问题
- 解决方法：通过将该目录添加到Git的安全目录列表来绕过这个所有权检查
- 命令操作：`git config --global --add safe.directory 'D:/Git_Repo/neetcode75'`
- 结果说明：这条命令会让Git把D:/Git_Repo/neetcode75目录标记为安全的，即使所有权不匹配，也不会阻止Git命令的执行。






## 推送过程的特殊情况
### 情况1：推送失败：某些文件过大（超过 Git 托管平台的限制）

> [!cite]+ 场景描述
>`git push`的时候发现文件太大，无法推送，但是已经`git commit`了，需要撤回最新提交


#### 操作步骤
#####  步骤一：撤销最近一次提交（保留工作区文件）

```
git reset --mixed HEAD~1
```

- `--mixed` 会保留工作区的修改，但清空暂存区
- 操作对象：仅针对本地仓库，与远程仓库无关。
- 具体效果 
	- 撤销最近一次 `git commit` 的内容，HEAD 指针回退到上一个提交。
	- 暂存区被重置为回退后的状态（即丢弃最后一次 `git add` 的内容）。
	- 工作目录中的文件保持不变（修改仍存在，但需要重新 `git add`）。


##### 步骤二： 添加 .gitignore

##### 步骤三：重新提交和推送



## git常用命令

### 强制覆盖本地代码，本地仓库更新到最新状态
#### 强制覆盖 
```python
git fetch --all
git reset --hard origin/master
git pull
```

#### 强制覆盖本地命令（单条执行）
```python
git fetch --all && git reset --hard origin/master && git pull
```

#### 确保仓库创建的文件（尚未被添加到版本控制中）也被删除
```python
git clean -n   # 预览将被删除的文件 
git clean -fd  # 不仅删除未跟踪的文件，还会删除未跟踪的空目录和包含未跟踪文件的目录
git clean -f  #- 实际删除工作区中未跟踪的**文件**（不包括目录）
```

#### 强制覆盖并删除本地文档
```
git fetch --all && git reset --hard origin/main && git clean -fd
```

### 常用更新3件套
```python
git add . 
git commit -m "note"
git push

```

```
git add . && git commit -m"sync" && git push
```


## 概念解释
### 1. 远程仓库绑定与推送权限控制的区别

无论是 HTTPS 还是 SSH 协议，通过 `git clone` 克隆仓库后，Git 都会**自动绑定远程仓库**（创建 `origin` 别名），这与"是否允许推送"是两个独立的概念：

1. **远程仓库绑定（remote）**：  
   这只是本地 Git 记录"远程仓库地址"的配置，目的是让你能用 `origin` 代替完整 URL 执行 `push`/`pull` 等操作，**与权限无关**。无论用哪种协议克隆，都会自动完成绑定。

2. **推送权限控制**：  
   能否推送到远程仓库，取决于你是否拥有该仓库的权限，以及是否通过了身份验证：
   - **HTTPS 协议**：推送时需要输入用户名和密码（或个人访问令牌），验证通过后才能推送。
   - **SSH 协议**：推送时通过本地 SSH 密钥与远程仓库的公钥匹配进行身份验证，无需输入密码，但前提是你已将 SSH 公钥添加到远程仓库（如 GitHub/GitLab 的账户设置中）。

简单说：  
- 绑定（`origin` 配置）是"告诉本地 Git 远程仓库在哪里"，克隆时自动完成。  
- 推送权限是"远程仓库是否允许你修改"，由身份验证和仓库权限设置决定，与绑定步骤无关。

即使通过 HTTPS 克隆后，若没有权限（未验证或未被授权），依然无法推送，并非"任何人都可以推送"。
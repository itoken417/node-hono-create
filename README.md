# nodejs + hono のプロジェクトを作成

# 説明

- Github 上のスケルトンを取得し、セットアップを行う
- setup.jsを動かし、Githubユーザー、テンプレートレポジトリを設定
- npmリンクでコマンド化したコマンドを実行
- 自動でテンプレートレポジトリを取得
- 自動でnpm installを実行
- 自動でテンプレートレポジトリ内のsetupフォルダ内のスクリプト実行し、初期化

## 使用方法

- installとコマンド有効化

1. 取得

```
git clone https://github.com/itoken417/node-hono-create.git
cd node-hono-create
npm install
```

2. Githubユーザーとレポジトリを指定する.envを作成

```
node setup.js
```

3. コマンド登録

```
npm link

```

- `create-myapp` コマンドが使用できるようになる。
- 新しいプロジェクト名を指定してコマンド実行

```
create-myapp [new project name]
```

- [new project name]のフォルダ内に、テンプレートがとってこられる。
- プロジェクト内で`nmp install`が実行される。
- プロジェクト内のsetupフォルダに設定されたスクリプトが実行される。
- プロンプトに従って、初期設定




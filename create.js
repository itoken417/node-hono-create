#!/usr/bin/env node
import degit from "degit";
import { execSync } from "child_process";
import { existsSync, readdirSync, chmodSync } from "fs";
import path from "path";

(async () => {
    const repo = "itoken417/node-hono-template"; // GitHub ユーザー名/リポジトリ名を指定
    const projectName = process.argv[2] || "my-project";
    const projectPath = path.resolve(process.cwd(), projectName);

  try {
    // 1. `degit` でリポジトリをクローン
    console.log(`Cloning template from ${repo} into ${projectPath}...`);
    const emitter = degit(repo, { cache: false, force: true });
    await emitter.clone(projectPath);
    console.log("Template cloned successfully!");

    // 2. プロジェクトフォルダに移動
    process.chdir(projectPath);

    // 3. `setup/` フォルダの有無をチェック
    const setupDir = path.join(projectPath, "setup");
    if (existsSync(setupDir)) {
      console.log("Found setup/ directory. Executing setup scripts...");

      // 4. setup/ フォルダ内のスクリプトを取得
      const setupScripts = readdirSync(setupDir)
        .filter(file => file.endsWith(".sh") || file.endsWith(".js"))
        .map(file => path.join(setupDir, file));

      // 5. スクリプトごとに実行
      for (const script of setupScripts) {
        console.log(`Executing ${script}...`);
        chmodSync(script, "755"); // 実行権限を付与

        if (script.endsWith(".sh")) {
          execSync(`bash "${script}"`, { stdio: "inherit" });
        } else if (script.endsWith(".js")) {
          execSync(`node "${script}"`, { stdio: "inherit" });
        }
      }
    } else {
      console.log("No setup/ directory found. Skipping setup scripts.");
    }

    // 6. `npm install` を実行
    console.log("Installing dependencies...");
    execSync("npm install", { stdio: "inherit" });

    console.log(`\nProject setup complete!`);
    console.log(`\nNext steps:\n  cd ${projectName}\n  npm start`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();


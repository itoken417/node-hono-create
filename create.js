#!/usr/bin/env node
import degit from "degit";
import { execSync } from "node:child_process";
import { existsSync, readdirSync, chmodSync } from "node:fs";
import path from "node:path";
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// __dirname を ESM で再現
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '.env') });

const user = process.env.GITHUB_USER;
const repos = process.env.GITHUB_REPOSITORY;
const  repo = `${user}/${repos}`;
console.log(`github user : ${user}`);
console.log(`github repository : ${repos}`);

(async () => {
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

    // 3. `npm install` を実行
    console.log("Installing dependencies...");
    execSync("npm install", { stdio: "inherit" });

    // 4. `setup/` フォルダの有無をチェック
    const setupDir = path.join(projectPath, "setup");
    if (existsSync(setupDir)) {
      console.log("Found setup/ directory. Executing setup scripts...");

      // 5. setup/ フォルダ内のスクリプトを取得
      const setupScripts = readdirSync(setupDir)
        .filter(file => file.endsWith(".sh") || file.endsWith(".js"))
        .map(file => path.join(setupDir, file));

      // 6. スクリプトごとに実行
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

    console.log(`\nProject setup complete!`);
    console.log(`\nNext steps:\n  cd ${projectName}\n  npm run dev`);
  } catch (err) {
    console.error("Error:", err.message);
    process.exit(1);
  }
})();


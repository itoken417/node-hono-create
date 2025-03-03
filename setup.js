import fs from 'fs/promises';
import readline from 'readline';
import path from 'path';
import { fileURLToPath } from 'url';

const file = '.env';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 対話形式の入力を設定
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

const askQuestion = (question) =>
    new Promise((resolve) => rl.question(question, resolve));

// デフォルトの設定値（必要に応じて調整）
const defaultConfig = {
    GITHUB_USER: 'itoken417',
    GITHUB_REPOSITORY: 'node-hono-template',
};

(async () => {
    console.log('=== .env File Generator ===');
    const config = {};

    for (const [key, defaultValue] of Object.entries(defaultConfig)) {
        const answer = await askQuestion(
            `${key} (default: ${defaultValue}): `
        );
        config[key] = answer || defaultValue;
    }

    rl.close();

    const envContent = Object.entries(config)
        .map(([key, value]) => `${key}=${value}`)
        .join('\n');

    const filepath = path.resolve(__dirname, file);
    console.log(filepath);
    // .env ファイルを作成
    await fs.writeFile(filepath, envContent, 'utf-8');

    console.log('\n.env file created successfully:');
    console.log(envContent);
})();



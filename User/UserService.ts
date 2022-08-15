import * as fs from 'fs';
import * as path from 'path';
import * as config from '../Config/AppConfig';

let backupDir = path.join(config.DATA_PATH);
let backupFile = path.join(backupDir, 'user.backup');

export let users = new Set<string>();

export function save() {
    try {
        if (!fs.existsSync(backupDir)) {
            fs.mkdirSync(backupDir);
        }
        // 하위 호환성을 고려해서 list형식으로 저장
        fs.writeFileSync(backupFile, JSON.stringify([...users.values()]));
    } catch (err) {
        console.error(err);
    }
}

export function load() {
    if (fs.existsSync(backupFile)) {
        console.log('load user');
        users = new Set(JSON.parse(fs.readFileSync(backupFile).toString()));
        console.log(module.exports.users);
    }
}
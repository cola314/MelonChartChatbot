import * as fs from 'fs';
import * as path from 'path';

const BACKUP_FILE_DIR = path.join(__dirname, 'data');
const BACKUP_FILE = path.join(BACKUP_FILE_DIR, 'user.backup');

export let users = new Set<string>();

export function saveUsers() {
    try {
        if (!fs.existsSync(BACKUP_FILE_DIR)) {
            fs.mkdirSync(BACKUP_FILE_DIR);
        }
        // 하위 호환성을 고려해서 list형식으로 저장
        fs.writeFileSync(BACKUP_FILE, JSON.stringify([...users.values()]));
    } catch (err) {
        console.error(err);
    }
}

export function loadUsers() {
    if (fs.existsSync(BACKUP_FILE)) {
        console.log('load user');
        users = new Set(JSON.stringify(fs.readFileSync(BACKUP_FILE)));
        console.log(module.exports.users);
    }
}
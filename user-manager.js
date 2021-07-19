const fs = require('fs');
const path = require('path');
const BACKUP_FILE_DIR = path.join(__dirname, 'data');
const BACKUP_FILE = path.join(BACKUP_FILE_DIR, 'user.backup');

module.exports.users = [];

const addUser = (user) => {
  if (!isExistUser(user)) {
    module.exports.users.push(user);
  }
}

const isExistUser = (user) => {
  return module.exports.users.indexOf(user) !== -1;
}

const deleteUser = (user) => {
  module.exports.users = module.exports.users.filter(e => e !== user);
}

function saveUsers() {
  try {
    if (!fs.existsSync(BACKUP_FILE_DIR)) {
      fs.mkdirSync(BACKUP_FILE_DIR);
    }
    fs.writeFileSync(BACKUP_FILE, JSON.stringify(module.exports.users), (err) => {
      console.error(err);
    });
  } catch (err) {
    console.error(err);
  }
}

function loadUsers() {
  try {
    if (fs.existsSync(BACKUP_FILE)) {
      console.log('load user');
      module.exports.users = JSON.parse(fs.readFileSync(BACKUP_FILE));
      console.log(module.exports.users);
    }
  } catch (err) {
    console.error(err);
  }
}

module.exports.addUser = addUser;
module.exports.isExistUser = isExistUser;
module.exports.deleteUser = deleteUser;
module.exports.saveUsers = saveUsers;
module.exports.loadUsers = loadUsers;
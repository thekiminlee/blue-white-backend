import { LowSync, JSONFileSync } from 'lowdb';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

// DB initialization
const __dirname = dirname(fileURLToPath(import.meta.url));
const adapters = new JSONFileSync('../data/users.json');

const db = new LowSync(adapters);

db.read();

export default db;
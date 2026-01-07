import { join } from 'path';
import Database from 'better-sqlite3';

export type DB = InstanceType<typeof Database>;

function initDb(dbPath?: string): DB {
    const file = dbPath ?? join(process.cwd(), 'puzzpals-data.db');
    
    const db = new Database(file);
    console.log('sqlite initialized at', file);
    
    createTable(db);
    
    return db;
}

function createTable(db: DB) {
    const sql = `CREATE TABLE IF NOT EXISTS rooms (
        token TEXT PRIMARY KEY UNIQUE,
        puzzle_data TEXT
    )`
    db.prepare(sql).run();
}

async function upsertRoom(_db: DB, _token: string, _puzzleJson: string | null, _gridJson: string | null) {
    // skeleton: implement upsert logic later
}

async function loadRoom(db: DB, token: string) {
    const sql = "SELECT puzzle_data FROM rooms WHERE token = ?";
    const row = db.prepare(sql).get(token) as { puzzle_data?: string } | undefined;

    if (!row || row.puzzle_data == null) {
        return null;
    }

    try {
        return JSON.parse(row.puzzle_data);
    } catch (err) {
        // This shouldn't happen unless the data is corrupted
        console.error('Failed to parse puzzle_data for token', token, err);
    }
}
export { initDb, upsertRoom, loadRoom };

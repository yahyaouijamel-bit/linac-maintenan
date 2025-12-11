import initSqlJs, { Database } from 'sql.js';

let db: Database | null = null;

const DB_STORAGE_KEY = 'linac_cmms_db';

export async function initDatabase(): Promise<Database> {
  if (db) return db;

  const SQL = await initSqlJs({
    locateFile: (file) => `https://sql.js.org/dist/${file}`
  });

  // Try to load existing database from localStorage
  const savedDb = localStorage.getItem(DB_STORAGE_KEY);
  if (savedDb) {
    const uint8Array = new Uint8Array(JSON.parse(savedDb));
    db = new SQL.Database(uint8Array);
  } else {
    db = new SQL.Database();
    createTables(db);
    seedDatabase(db);
  }

  return db;
}

export function getDatabase(): Database | null {
  return db;
}

export function saveDatabase(): void {
  if (!db) return;
  const data = db.export();
  const arr = Array.from(data);
  localStorage.setItem(DB_STORAGE_KEY, JSON.stringify(arr));
}

function createTables(database: Database): void {
  database.run(`
    CREATE TABLE IF NOT EXISTS equipments (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      model TEXT NOT NULL,
      serial_number TEXT NOT NULL,
      installation_date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('operational', 'maintenance', 'down'))
    );

    CREATE TABLE IF NOT EXISTS tickets (
      id TEXT PRIMARY KEY,
      number TEXT NOT NULL,
      subject TEXT NOT NULL,
      description TEXT NOT NULL,
      equipment_id TEXT NOT NULL,
      priority TEXT NOT NULL CHECK(priority IN ('high', 'medium', 'low')),
      status TEXT NOT NULL CHECK(status IN ('open', 'in-progress', 'resolved')),
      created_at TEXT NOT NULL,
      resolved_at TEXT,
      FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    );

    CREATE TABLE IF NOT EXISTS downtimes (
      id TEXT PRIMARY KEY,
      equipment_id TEXT NOT NULL,
      reason TEXT NOT NULL,
      start_time TEXT NOT NULL,
      end_time TEXT,
      status TEXT NOT NULL CHECK(status IN ('ongoing', 'resolved')),
      FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    );

    CREATE TABLE IF NOT EXISTS maintenance_tasks (
      id TEXT PRIMARY KEY,
      task TEXT NOT NULL,
      equipment_id TEXT NOT NULL,
      due_date TEXT NOT NULL,
      status TEXT NOT NULL CHECK(status IN ('planned', 'completed', 'overdue')),
      completed_date TEXT,
      FOREIGN KEY (equipment_id) REFERENCES equipments(id)
    );

    CREATE TABLE IF NOT EXISTS work_orders (
      id TEXT PRIMARY KEY,
      equipment_id TEXT NOT NULL,
      description TEXT NOT NULL,
      assigned_to TEXT,
      priority TEXT NOT NULL CHECK(priority IN ('high', 'medium', 'low')),
      status TEXT NOT NULL CHECK(status IN ('open', 'in-progress', 'closed')),
      created_at TEXT NOT NULL,
      completed_at TEXT,
      FOREIGN KEY (equipment_id) REFERENCES equipments(id),
      FOREIGN KEY (assigned_to) REFERENCES technicians(id)
    );

    CREATE TABLE IF NOT EXISTS spare_parts (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      part_number TEXT NOT NULL,
      quantity INTEGER NOT NULL DEFAULT 0,
      location TEXT NOT NULL,
      acquisition_date TEXT,
      installation_date TEXT
    );

    CREATE TABLE IF NOT EXISTS technicians (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      phone TEXT NOT NULL,
      specialization TEXT NOT NULL
    );
  `);
}

function seedDatabase(database: Database): void {
  // Seed equipments
  database.run(`
    INSERT INTO equipments VALUES 
    ('eq-001', 'Linac Elekta Versa HD', 'Versa HD', 'VHD-2023-001', '2023-01-15', 'operational'),
    ('eq-002', 'Linac Elekta Infinity', 'Infinity', 'INF-2022-003', '2022-06-20', 'operational'),
    ('eq-003', 'Linac Elekta Synergy', 'Synergy', 'SYN-2021-007', '2021-03-10', 'maintenance'),
    ('eq-004', 'Linac Elekta Precise', 'Precise', 'PRC-2020-012', '2020-11-05', 'down')
  `);

  // Seed technicians
  database.run(`
    INSERT INTO technicians VALUES 
    ('tech-001', 'Jean Dupont', 'jean.dupont@hospital.fr', '01 23 45 67 89', 'Linac Elekta'),
    ('tech-002', 'Marie Martin', 'marie.martin@hospital.fr', '01 23 45 67 90', 'Électronique médicale'),
    ('tech-003', 'Pierre Bernard', 'pierre.bernard@hospital.fr', '01 23 45 67 91', 'Mécanique de précision')
  `);

  // Seed tickets
  database.run(`
    INSERT INTO tickets VALUES 
    ('tkt-001', 'TKT-2024-001', 'Erreur de calibration', 'Le système affiche une erreur lors de la calibration journalière', 'eq-001', 'high', 'open', '2024-01-20T09:00:00', NULL),
    ('tkt-002', 'TKT-2024-002', 'Bruit anormal', 'Bruit inhabituel détecté lors du mouvement du bras', 'eq-002', 'medium', 'in-progress', '2024-01-19T14:30:00', NULL),
    ('tkt-003', 'TKT-2024-003', 'Maintenance préventive requise', 'Rappel pour maintenance trimestrielle', 'eq-003', 'low', 'resolved', '2024-01-15T08:00:00', '2024-01-18T16:00:00')
  `);

  // Seed downtimes
  database.run(`
    INSERT INTO downtimes VALUES 
    ('dt-001', 'eq-004', 'Panne du système de refroidissement', '2024-01-18T10:00:00', NULL, 'ongoing'),
    ('dt-002', 'eq-003', 'Maintenance préventive planifiée', '2024-01-15T08:00:00', '2024-01-15T17:00:00', 'resolved'),
    ('dt-003', 'eq-001', 'Remplacement pièce défectueuse', '2024-01-10T09:00:00', '2024-01-12T14:00:00', 'resolved')
  `);

  // Seed maintenance tasks
  database.run(`
    INSERT INTO maintenance_tasks VALUES 
    ('mt-001', 'Calibration mensuelle', 'eq-001', '2024-02-01', 'planned', NULL),
    ('mt-002', 'Inspection des câbles', 'eq-002', '2024-01-25', 'planned', NULL),
    ('mt-003', 'Vérification système hydraulique', 'eq-003', '2024-01-15', 'overdue', NULL),
    ('mt-004', 'Test de sécurité annuel', 'eq-001', '2024-01-10', 'completed', '2024-01-10')
  `);

  // Seed work orders
  database.run(`
    INSERT INTO work_orders VALUES 
    ('wo-001', 'eq-004', 'Diagnostic et réparation système de refroidissement', 'tech-001', 'high', 'open', '2024-01-18T10:30:00', NULL),
    ('wo-002', 'eq-002', 'Investigation bruit anormal', 'tech-003', 'medium', 'in-progress', '2024-01-19T15:00:00', NULL),
    ('wo-003', 'eq-003', 'Maintenance préventive Q1', 'tech-002', 'low', 'closed', '2024-01-14T08:00:00', '2024-01-15T17:00:00')
  `);

  // Seed spare parts
  database.run(`
    INSERT INTO spare_parts VALUES 
    ('sp-001', 'Filtre à air HEPA', 'FLT-HEPA-001', 5, 'Armoire A1', '2023-12-01', NULL),
    ('sp-002', 'Câble de connexion MLC', 'CBL-MLC-002', 3, 'Armoire B2', '2023-11-15', '2024-01-10'),
    ('sp-003', 'Joint torique système hydraulique', 'JNT-HYD-003', 10, 'Armoire A3', '2023-10-20', NULL),
    ('sp-004', 'Carte électronique de contrôle', 'CRT-CTL-004', 2, 'Armoire C1', '2024-01-05', NULL)
  `);

  saveDatabase();
}

// Query helpers
export function runQuery<T>(sql: string, params: any[] = []): T[] {
  if (!db) return [];
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const results: T[] = [];
  while (stmt.step()) {
    results.push(stmt.getAsObject() as T);
  }
  stmt.free();
  return results;
}

export function runCommand(sql: string, params: any[] = []): void {
  if (!db) return;
  db.run(sql, params);
  saveDatabase();
}

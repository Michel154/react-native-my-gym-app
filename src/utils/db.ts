import * as SQLite from "expo-sqlite";

let dbInstance: SQLite.SQLiteDatabase | null = null;

// Funktion för att hämta (och öppna) databasen asynkront
async function getDb() {
  if (!dbInstance) {
    dbInstance = await SQLite.openDatabaseAsync("gymmlogg.db");
  }
  return dbInstance;
}

export interface WorkoutEntry {
  id: string;
  date: string;
  title: string;
  notes: string;
  mood: string;
  imageUri?: string;
}

export async function initDatabase() {
  try {
    const db = await getDb();
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS workouts (
        id TEXT PRIMARY KEY NOT NULL,
        date TEXT NOT NULL,
        timestamp INTEGER NOT NULL,
        title TEXT NOT NULL,
        notes TEXT,
        mood TEXT,
        imageUri TEXT
      );
    `);
  } catch (error) {
    console.error("Kunde inte initiera databasen", error);
  }
}

export const getEntries = async (): Promise<WorkoutEntry[]> => {
  try {
    const db = await getDb();
    const rows = (await db.getAllAsync(
      `SELECT * FROM workouts ORDER BY timestamp DESC`
    )) as WorkoutEntry[];

    console.log("DATABAS-INNEHÅLL:", JSON.stringify(rows, null, 2));

    return rows;
  } catch (error) {
    console.error("Kunde inte hämta träningspass", error);
    return [];
  }
};

export const saveEntry = async (
  entry: Omit<WorkoutEntry, "id">
): Promise<void> => {
  try {
    const db = await getDb();
    const id = Date.now().toString();
    const timestamp = Date.now();

    await db.runAsync(
      "INSERT INTO workouts (id, date, timestamp, title, notes, mood, imageUri) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        entry.date,
        timestamp,
        entry.title,
        entry.notes,
        entry.mood,
        entry.imageUri || null,
      ]
    );
  } catch (error) {
    console.error("Kunde inte spara träningspass", error);
  }
};

export const deleteEntry = async (id: string): Promise<void> => {
  try {
    const db = await getDb();
    await db.runAsync("DELETE FROM workouts WHERE id = ?", [id]);
  } catch (error) {
    console.error("Kunde inte ta bort träningspass", error);
  }
};
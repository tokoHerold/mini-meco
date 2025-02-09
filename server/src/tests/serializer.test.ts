import { describe, it, expect } from "vitest";
import { initializeDB } from "../databaseInitializer";
import { Database } from "sqlite";

describe('Basic serializer read/write test', async () => {
  const db: Database = await initializeDB();
  it('Default Admin User created properly', async () => {
    const nameObj = await db.get(`SELECT name FROM users WHERE email = ?`, "sys@admin.org");
    expect(!nameObj).toBe(false);
    const name: string = nameObj.name;
    expect(name).toBe("admin");
  });

  it('')
});

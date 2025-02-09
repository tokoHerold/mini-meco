import { describe, it, expect } from "vitest";
import { initializeDB } from "../databaseInitializer";
import { Database } from "sqlite";
import { ObjectHandler } from "../ObjectHandler";
import { User } from "../Models/User";

describe('Basic serializer read/write test', async () => {
  const db: Database = await initializeDB();
  const oh = new ObjectHandler();
  it('Default Admin User created properly', async () => {
    const nameObj = await db.get(`SELECT name FROM users WHERE email = ?`, "sys@admin.org");
    expect(!nameObj).toBe(false);
    const name: string = nameObj.name;
    expect(name).toBe("admin");
  });

  it('Reading default Admin User', async () => {
    const u: User | null = await oh.getUser(1, db);
    expect(u !== null).toBe(true);
    expect(u?.getName()).toBe("admin");
  })
});

import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { hashPassword } from './hash';

const DEFAULT_USER = {
  name: "admin",
  email: "sys@admin.org",
  password: "helloworld"
};

export async function initializeDB() {
  const db = await open({
    filename: './myDatabase.db',
    driver: sqlite3.Database,
  });

  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT,
      githubUsername TEXT,
      email TEXT UNIQUE,
      status TEXT DEFAULT "unconfirmed" NOT NULL,
      password TEXT,
      resetPasswordToken TEXT,
      resetPasswordExpire INTEGER,
      confirmEmailToken TEXT,
      confirmEmailExpire INTEGER
    )
  `);

  const userCount = await db.get('SELECT COUNT(*) AS count FROM users');
  if (userCount.count === 0) {
    const { name, email, password } = DEFAULT_USER;
    await db.run(
      `INSERT INTO users (name, email, password, status) VALUES (?, ?, ?, ?)`,
      [name, email, await hashPassword(password), 'confirmed']
    );
    console.log(`Default admin user created: (email: '${email}', password: '${password}')`);
  }

  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectName TEXT UNIQUE,
      courseId INTEGER,
      FOREIGN KEY (courseId) REFERENCES courses(id)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS courses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      semester TEXT,
      courseName TEXT UNIQUE
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS user_projects (
      userId INTEGER,
      projectId INTEGER,
      role TEXT,
      url TEXT,
      PRIMARY KEY (userId, projectId),
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (projectId) REFERENCES projects(id)
    )
    `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS sprints (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      courseId INTEGER NOT NULL,
      sprintName TEXT NOT NULL,
      endDate DATETIME NOT NULL,
      FOREIGN KEY (courseId) REFERENCES courses(id)
    )
  `);

  await db.exec(`
    CREATE TABLE IF NOT EXISTS happiness (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      projectId INTEGER,
      userId INTEGER,
      happiness INTEGER,
      sprintId INTEGER,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id),
      FOREIGN KEY (projectId) REFERENCES projects(id)
    )
  `);

  return db;
}

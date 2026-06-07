import mysql from 'mysql2/promise'

const pool = mysql.createPool({
  host: process.env.DB_HOST ?? '127.0.0.1',
  port: Number(process.env.DB_PORT ?? 3306),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

export async function query<T>(sql: string, params?: unknown[]): Promise<T[]> {
  try {
    const [rows] = await pool.execute(sql, params as any)
    return rows as T[]
  } catch (err) {
    console.error('[db] query failed:', sql, err)
    return []
  }
}

import mysql, { type ExecuteValues, type Pool } from 'mysql2/promise'

declare global {
  // eslint-disable-next-line no-var
  var _dbPool: Pool | undefined
}

const pool =
  global._dbPool ??
  (global._dbPool = mysql.createPool({
    host: process.env.DB_HOST ?? 'localhost',
    port: Number(process.env.DB_PORT ?? 3306),
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    connectTimeout: 10000,
    enableKeepAlive: true,
    keepAliveInitialDelay: 30000,
  }))

export async function query<T>(sql: string, params?: unknown[]): Promise<T[]> {
  const [rows] = await pool.execute(sql, params as ExecuteValues)
  return rows as T[]
}

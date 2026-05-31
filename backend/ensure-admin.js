import pool from './config/database.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const ensureAdmin = async () => {
  try {
    const name = 'Admin Event'
    const email = 'adminevent@gmail.com'
    const plainPassword = 'admin123'
    const hashedPassword = await bcrypt.hash(plainPassword, 10)

    await pool.query(
      `INSERT INTO admins (name, email, password, created_at, updated_at)
       VALUES (?, ?, ?, NOW(), NOW())
       ON DUPLICATE KEY UPDATE
         name = VALUES(name),
         password = VALUES(password),
         updated_at = NOW()`,
      [name, email, hashedPassword]
    )

    console.log('✓ Admin ready')
    console.log('Name:', name)
    console.log('Email:', email)
    console.log('Password:', plainPassword)
  } catch (error) {
    console.error('✗ Failed to ensure admin:', error.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

ensureAdmin()

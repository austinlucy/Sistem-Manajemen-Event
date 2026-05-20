import pool from './config/database.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const createNewAdmin = async () => {
  try {
    const name = 'admin'
    const email = 'admin@gmail.com'
    const plainPassword = 'admin123'
    
    const hashedPassword = await bcrypt.hash(plainPassword, 10)
    
    const [result] = await pool.query(
      'INSERT INTO admins (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword]
    )
    
    console.log('✓ Admin user created successfully!')
    console.log('Name:', name)
    console.log('Email:', email)
    console.log('Password:', plainPassword)
    console.log('Admin ID:', result.insertId)
    
    process.exit(0)
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      console.error('✗ Error: Email already exists in database')
    } else {
      console.error('✗ Error creating admin:', error.message)
    }
    process.exit(1)
  }
}

createNewAdmin()

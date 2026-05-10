import pool from './config/database.js'
import dotenv from 'dotenv'

dotenv.config()

const createAdmin = async () => {
  try {
    const hashedPassword = '$2a$10$PTxH2/BPKmTGT6rzazoyKeS/etmsllIt2VauNe0B3QR2kl/T6nahu'
    
    const [result] = await pool.query(
      'INSERT INTO admins (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      ['Admin', 'admin@campus.com', hashedPassword]
    )
    
    console.log('✓ Admin user created successfully!')
    console.log('Email: admin@campus.com')
    console.log('Password: admin123')
    console.log('Admin ID:', result.insertId)
    
    process.exit(0)
  } catch (error) {
    console.error('✗ Error creating admin:', error.message)
    process.exit(1)
  }
}

createAdmin()

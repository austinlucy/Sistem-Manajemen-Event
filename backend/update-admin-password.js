import pool from './config/database.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const updateAdminPassword = async () => {
  try {
    const email = 'admin@gmail.com'
    const newPassword = 'admin123'
    
    const hashedPassword = await bcrypt.hash(newPassword, 10)
    
    const [result] = await pool.query(
      'UPDATE admins SET password = ?, updated_at = NOW() WHERE email = ?',
      [hashedPassword, email]
    )
    
    if (result.affectedRows === 0) {
      console.log('✗ Admin not found')
      process.exit(1)
    }
    
    console.log('✓ Admin password updated successfully!')
    console.log('Email:', email)
    console.log('Password:', newPassword)
    
    process.exit(0)
  } catch (error) {
    console.error('✗ Error updating admin:', error.message)
    process.exit(1)
  }
}

updateAdminPassword()

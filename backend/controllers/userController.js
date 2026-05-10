import pool from '../config/database.js'
import path from 'path'
import { fileURLToPath } from 'url'
import fs from 'fs'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Get user profile
export const getUserProfile = async (req, res) => {
  try {
    const user_id = req.user.id
    const [users] = await pool.query(
      'SELECT id, name, email, photo FROM users WHERE id = ?',
      [user_id]
    )

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(users[0])
  } catch (error) {
    console.error('Get profile error:', error)
    res.status(500).json({ message: 'Failed to fetch profile' })
  }
}

// Update user profile
export const updateUserProfile = async (req, res) => {
  try {
    const user_id = req.user.id
    const { name, email } = req.body

    await pool.query(
      'UPDATE users SET name=?, email=?, updated_at=NOW() WHERE id=?',
      [name, email, user_id]
    )

    res.json({ message: 'Profile updated successfully' })
  } catch (error) {
    console.error('Update profile error:', error)
    res.status(500).json({ message: 'Failed to update profile' })
  }
}

// Upload photo
export const uploadPhoto = async (req, res) => {
  try {
    const user_id = req.user.id
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' })
    }

    const photoPath = `/uploads/${req.file.filename}`

    await pool.query(
      'UPDATE users SET photo=?, updated_at=NOW() WHERE id=?',
      [photoPath, user_id]
    )

    res.json({
      message: 'Photo uploaded successfully',
      photoPath
    })
  } catch (error) {
    console.error('Upload photo error:', error)
    res.status(500).json({ message: 'Failed to upload photo' })
  }
}

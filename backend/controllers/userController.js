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
    if (req.user.role === 'admin') {
      const [admins] = await pool.query(
        'SELECT id, name, email FROM admins WHERE id = ?',
        [user_id]
      )

      if (admins.length === 0) {
        return res.status(404).json({ message: 'Admin not found' })
      }

      return res.json({
        id: admins[0].id,
        name: admins[0].name,
        email: admins[0].email,
        role: 'admin',
        photo: null
      })
    }

    const [users] = await pool.query(
      'SELECT id, name, email, role, photo FROM users WHERE id = ?',
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

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' })
    }

    if (req.user.role === 'admin') {
      const [admins] = await pool.query(
        'SELECT id FROM admins WHERE id = ?',
        [user_id]
      )

      if (admins.length === 0) {
        return res.status(404).json({ message: 'Admin not found' })
      }

      await pool.query(
        'UPDATE admins SET name=?, email=?, updated_at=NOW() WHERE id=?',
        [name, email, user_id]
      )

      const [updatedAdmins] = await pool.query(
        'SELECT id, name, email FROM admins WHERE id = ? LIMIT 1',
        [user_id]
      )

      return res.json({
        message: 'Profile updated successfully',
        user: {
          id: updatedAdmins[0].id,
          name: updatedAdmins[0].name,
          email: updatedAdmins[0].email,
          role: 'admin',
          photo: null
        }
      })
    }

    const [users] = await pool.query(
      'SELECT photo FROM users WHERE id = ?',
      [user_id]
    )

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    await pool.query(
      'UPDATE users SET name=?, email=?, updated_at=NOW() WHERE id=?',
      [name, email, user_id]
    )

    const [updatedUsers] = await pool.query(
      'SELECT id, name, email, photo FROM users WHERE id = ? LIMIT 1',
      [user_id]
    )

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: updatedUsers[0].id,
        name: updatedUsers[0].name,
        email: updatedUsers[0].email,
        role: 'user',
        photo: updatedUsers[0].photo || users[0].photo || null
      }
    })
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

    const [users] = await pool.query(
      'SELECT id, name, email, photo FROM users WHERE id = ?',
      [user_id]
    )

    res.json({
      message: 'Photo uploaded successfully',
      photoPath,
      user: {
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
        role: 'user',
        photo: users[0].photo || photoPath
      }
    })
  } catch (error) {
    console.error('Upload photo error:', error)
    res.status(500).json({ message: 'Failed to upload photo' })
  }
}

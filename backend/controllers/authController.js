import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/database.js'

// Register user
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Check if user exists
    const [existingUser] = await pool.query(
      'SELECT id FROM users WHERE email = ?',
      [email]
    )

    if (existingUser.length > 0) {
      return res.status(400).json({ message: 'User already exists' })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const [result] = await pool.query(
      'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      [name, email, hashedPassword]
    )

    const userId = result.insertId

    // Create JWT token
    const token = jwt.sign(
      { id: userId, email, role: 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        id: userId,
        name,
        email,
        role: 'user'
      }
    })
  } catch (error) {
    console.error('Register error:', error)
    res.status(500).json({ message: 'Registration failed' })
  }
}

// Login user
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    // Check if user exists
    const [users] = await pool.query(
      'SELECT id, name, email, password, role FROM users WHERE email = ?',
      [email]
    )

    if (users.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const user = users[0]

    // Verify password
    const passwordMatch = await bcrypt.compare(password, user.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role || 'user' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role || 'user'
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
}

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' })
    }

    // Check if admin exists
    const [admins] = await pool.query(
      'SELECT id, name, email, password FROM admins WHERE email = ?',
      [email]
    )

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const admin = admins[0]

    // Verify password
    const passwordMatch = await bcrypt.compare(password, admin.password)

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    // Create JWT token
    const token = jwt.sign(
      { id: admin.id, email: admin.email, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    res.json({
      message: 'Admin login successful',
      token,
      user: {
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin'
      }
    })
  } catch (error) {
    console.error('Admin login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
}

// Verify token
export const verifyToken = async (req, res) => {
  try {
    res.json({
      message: 'Token is valid',
      user: req.user
    })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

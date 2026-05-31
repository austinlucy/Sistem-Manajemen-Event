import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import pool from '../config/database.js'
import { sendMail } from '../utils/mailer.js'

const verifyAndUpgradePassword = async ({ table, id, storedPassword, inputPassword }) => {
  if (!storedPassword) return false

  const isBcryptHash = /^\$2[aby]\$\d{2}\$/.test(storedPassword)
  if (isBcryptHash) {
    return bcrypt.compare(inputPassword, storedPassword)
  }

  const passwordMatch = inputPassword === storedPassword
  if (passwordMatch) {
    const hashedPassword = await bcrypt.hash(inputPassword, 10)
    await pool.query(
      `UPDATE ${table} SET password=?, updated_at=NOW() WHERE id=?`,
      [hashedPassword, id]
    )
  }

  return passwordMatch
}

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

    sendMail({
      to: email,
      subject: 'Registrasi Event Hub Berhasil',
      text: `Halo ${name}, akun Event Hub Anda berhasil dibuat. Selamat menjelajahi event kampus.`,
      html: `<p>Halo <strong>${name}</strong>, akun Event Hub Anda berhasil dibuat.</p><p>Selamat menjelajahi event kampus.</p>`
    }).catch(error => console.warn('Registration email skipped:', error.message))

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
    const identifier = String(email || '').trim()

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/username and password required' })
    }

    // Check if user exists. Login form accepts email OR username/name.
    const [users] = await pool.query(
      'SELECT id, name, email, password, photo FROM users WHERE email = ? OR name = ? LIMIT 1',
      [identifier, identifier]
    )

    if (users.length > 0) {
      const user = users[0]
      const passwordMatch = await verifyAndUpgradePassword({
        table: 'users',
        id: user.id,
        storedPassword: user.password,
        inputPassword: password
      })

      if (passwordMatch) {
        const token = jwt.sign(
          { id: user.id, email: user.email, role: 'user' },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        )

        return res.json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: 'user',
            photo: user.photo || null
          }
        })
      }
    }

    // Fallback: allow admin credentials from the normal login tab too.
    const [admins] = await pool.query(
      'SELECT id, name, email, password FROM admins WHERE email = ? OR name = ? LIMIT 1',
      [identifier, identifier]
    )

    if (admins.length > 0) {
      const admin = admins[0]
      const passwordMatch = await verifyAndUpgradePassword({
        table: 'admins',
        id: admin.id,
        storedPassword: admin.password,
        inputPassword: password
      })

      if (passwordMatch) {
        const token = jwt.sign(
          { id: admin.id, email: admin.email, role: 'admin' },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        )

        return res.json({
          message: 'Admin login successful',
          token,
          user: {
            id: admin.id,
            name: admin.name,
            email: admin.email,
            role: 'admin',
            photo: null
          }
        })
      }
    }

    return res.status(401).json({ message: 'Invalid credentials' })
  } catch (error) {
    console.error('Login error:', error)
    res.status(500).json({ message: 'Login failed' })
  }
}

// Login admin
export const loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body
    const identifier = String(email || '').trim()

    // Validate input
    if (!identifier || !password) {
      return res.status(400).json({ message: 'Email/username and password required' })
    }

    // Check if admin exists
    const [admins] = await pool.query(
      'SELECT id, name, email, password FROM admins WHERE email = ? OR name = ? LIMIT 1',
      [identifier, identifier]
    )

    if (admins.length === 0) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const admin = admins[0]

    if (!admin.password) {
      console.error('Admin login error: password hash is empty for admin id', admin.id)
      return res.status(500).json({ message: 'Admin account password is not configured' })
    }

    // Verify password. Support old/plain seeded passwords too, then upgrade to bcrypt.
    const passwordMatch = await verifyAndUpgradePassword({
      table: 'admins',
      id: admin.id,
      storedPassword: admin.password,
      inputPassword: password
    })

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
    console.error('Admin login error:', {
      message: error.message,
      code: error.code,
      sqlMessage: error.sqlMessage
    })
    res.status(500).json({ message: error.sqlMessage || error.message || 'Login failed' })
  }
}

// Verify token
export const verifyToken = async (req, res) => {
  try {
    if (req.user.role === 'admin') {
      const [admins] = await pool.query(
        'SELECT id, name, email FROM admins WHERE id = ?',
        [req.user.id]
      )

      if (admins.length === 0) {
        return res.status(404).json({ message: 'Admin not found' })
      }

      return res.json({
        message: 'Token is valid',
        user: {
          id: admins[0].id,
          name: admins[0].name,
          email: admins[0].email,
          role: 'admin',
          photo: null
        }
      })
    }

    const [users] = await pool.query(
      'SELECT id, name, email, photo FROM users WHERE id = ? LIMIT 1',
      [req.user.id]
    )

    if (users.length === 0) {
      return res.status(404).json({ message: 'User not found' })
    }

    console.log('Verify token user:', {
      id: users[0].id,
      email: users[0].email,
      photo: users[0].photo
    })

    res.json({
      message: 'Token is valid',
      user: {
        id: users[0].id,
        name: users[0].name,
        email: users[0].email,
        role: 'user',
        photo: users[0].photo || null
      }
    })
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' })
  }
}

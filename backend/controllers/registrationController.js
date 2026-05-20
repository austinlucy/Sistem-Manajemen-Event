import pool from '../config/database.js'

// Register for event
export const registerEvent = async (req, res) => {
  try {
    const { event_id } = req.body
    const user_id = req.user.id

    // Check if already registered
    const [existing] = await pool.query(
      'SELECT id FROM registrations WHERE user_id = ? AND event_id = ?',
      [user_id, event_id]
    )

    if (existing.length > 0) {
      return res.status(400).json({ message: 'Already registered for this event' })
    }

    // Get event quota info
    const [eventData] = await pool.query(
      'SELECT id, quota FROM events WHERE id = ?',
      [event_id]
    )

    if (eventData.length === 0) {
      return res.status(404).json({ message: 'Event not found' })
    }

    const event = eventData[0]

    // Count current approved registrations
    const [registrationCount] = await pool.query(
      'SELECT COUNT(*) as count FROM registrations WHERE event_id = ? AND status_id = 2', // 2 = approved
      [event_id]
    )

    const approvedCount = registrationCount[0].count

    // Check if quota is full (only count approved registrations against quota)
    if (approvedCount >= event.quota) {
      return res.status(400).json({ 
        message: 'Event is full. No more registrations allowed.',
        currentQuota: approvedCount,
        maxQuota: event.quota
      })
    }

    // Insert registration (default to pending status)
    const [result] = await pool.query(
      'INSERT INTO registrations (user_id, event_id, status_id, registered_at) VALUES (?, ?, ?, NOW())',
      [user_id, event_id, 1] // 1 = pending
    )

    res.status(201).json({
      message: 'Registered successfully. Waiting for admin approval.',
      registrationId: result.insertId
    })
  } catch (error) {
    console.error('Register event error:', error)
    res.status(500).json({ message: 'Failed to register' })
  }
}

// Get my registrations
export const getMyRegistrations = async (req, res) => {
  try {
    const user_id = req.user.id

    const [registrations] = await pool.query(`
      SELECT r.id, r.user_id, r.event_id, r.registered_at, r.status_id,
             e.title as event_title, e.event_date, e.location, e.banner, e.category_id,
             ps.status_name as status
      FROM registrations r
      JOIN events e ON r.event_id = e.id
      LEFT JOIN participant_status ps ON r.status_id = ps.id
      WHERE r.user_id = ?
      ORDER BY e.event_date ASC
    `, [user_id])

    res.json(registrations)
  } catch (error) {
    console.error('Get registrations error:', error)
    res.status(500).json({ message: 'Failed to fetch registrations' })
  }
}

// Cancel registration
export const cancelRegistration = async (req, res) => {
  try {
    const { id } = req.params
    const user_id = req.user.id

    const [result] = await pool.query(
      'DELETE FROM registrations WHERE id = ? AND user_id = ?',
      [id, user_id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Registration not found' })
    }

    res.json({ message: 'Registration cancelled' })
  } catch (error) {
    console.error('Cancel registration error:', error)
    res.status(500).json({ message: 'Failed to cancel registration' })
  }
}

import pool from '../config/database.js'

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const limit = req.query.limit || 100
    const [events] = await pool.query(`
      SELECT e.*, c.category_name, a.name as admin_name
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      LEFT JOIN admins a ON e.admin_id = a.id
      LIMIT ?
    `, [parseInt(limit)])

    res.json({
      message: 'Events retrieved successfully',
      data: events
    })
  } catch (error) {
    console.error('Get events error:', error)
    res.status(500).json({ message: 'Failed to fetch events' })
  }
}

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params
    const [events] = await pool.query(`
      SELECT e.*, c.category_name, a.name as admin_name
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      LEFT JOIN admins a ON e.admin_id = a.id
      WHERE e.id = ?
    `, [id])

    if (events.length === 0) {
      return res.status(404).json({ message: 'Event not found' })
    }

    res.json(events[0])
  } catch (error) {
    console.error('Get event error:', error)
    res.status(500).json({ message: 'Failed to fetch event' })
  }
}

// Create event (admin only)
export const createEvent = async (req, res) => {
  try {
    const { title, description, banner, location, quota, event_date, category_id } = req.body
    const admin_id = req.user.id

    // Validate input
    if (!title || !description || !location || !quota || !event_date) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    const [result] = await pool.query(
      `INSERT INTO events (category_id, admin_id, title, description, banner, location, quota, event_date, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [category_id || 1, admin_id, title, description, banner, location, quota, event_date]
    )

    res.status(201).json({
      message: 'Event created successfully',
      eventId: result.insertId
    })
  } catch (error) {
    console.error('Create event error:', error)
    res.status(500).json({ message: 'Failed to create event' })
  }
}

// Update event (admin only)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, banner, location, quota, event_date } = req.body

    const [result] = await pool.query(
      `UPDATE events SET title=?, description=?, banner=?, location=?, quota=?, event_date=?, updated_at=NOW()
       WHERE id = ? AND admin_id = ?`,
      [title, description, banner, location, quota, event_date, id, req.user.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found or unauthorized' })
    }

    res.json({ message: 'Event updated successfully' })
  } catch (error) {
    console.error('Update event error:', error)
    res.status(500).json({ message: 'Failed to update event' })
  }
}

// Delete event (admin only)
export const deleteEvent = async (req, res) => {
  try {
    const { id } = req.params

    const [result] = await pool.query(
      'DELETE FROM events WHERE id = ? AND admin_id = ?',
      [id, req.user.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Event not found or unauthorized' })
    }

    res.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Delete event error:', error)
    res.status(500).json({ message: 'Failed to delete event' })
  }
}

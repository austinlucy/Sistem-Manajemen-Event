import pool from '../config/database.js'

// Get all events
export const getAllEvents = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page, 10) || 1, 1)
    const limit = Math.min(Math.max(parseInt(req.query.limit, 10) || 100, 1), 100)
    const offset = (page - 1) * limit
    const search = (req.query.search || '').trim()
    const categoryId = req.query.category_id || req.query.category
    const status = req.query.status || 'all'
    const sort = req.query.sort || 'date_asc'
    const adminId = req.query.admin_id || req.query.admin

    const where = []
    const params = []

    if (search) {
      where.push('(e.title LIKE ? OR e.description LIKE ? OR e.location LIKE ?)')
      params.push(`%${search}%`, `%${search}%`, `%${search}%`)
    }

    if (categoryId) {
      where.push('e.category_id = ?')
      params.push(categoryId)
    }

    if (adminId) {
      where.push('e.admin_id = ?')
      params.push(adminId)
    }

    if (status === 'upcoming') where.push('e.event_date >= NOW()')
    if (status === 'past') where.push('e.event_date < NOW()')

    const whereSql = where.length ? `WHERE ${where.join(' AND ')}` : ''
    const orderSql = {
      date_asc: 'e.event_date ASC',
      date_desc: 'e.event_date DESC',
      newest: 'e.created_at DESC',
      oldest: 'e.created_at ASC',
      title_asc: 'e.title ASC'
    }[sort] || 'e.event_date ASC'

    const [[countResult]] = await pool.query(
      `SELECT COUNT(*) as total
       FROM events e
       LEFT JOIN event_categories c ON e.category_id = c.id
       LEFT JOIN admins a ON e.admin_id = a.id
       ${whereSql}`,
      params
    )

    const [events] = await pool.query(`
      SELECT e.*, c.category_name, a.name as admin_name,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status_id = 2) as registered_count
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      LEFT JOIN admins a ON e.admin_id = a.id
      ${whereSql}
      ORDER BY ${orderSql}
      LIMIT ? OFFSET ?
    `, [...params, limit, offset])

    const total = countResult.total || 0
    const totalPages = Math.max(Math.ceil(total / limit), 1)

    res.json({
      message: 'Events retrieved successfully',
      data: events,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      }
    })
  } catch (error) {
    console.error('Get events error:', error)
    res.status(500).json({ message: 'Failed to fetch events' })
  }
}

// Get public homepage statistics
export const getPublicStats = async (req, res) => {
  try {
    const [[stats]] = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM events WHERE event_date >= NOW()) as activeEvents,
        (SELECT COUNT(*) FROM registrations WHERE status_id = 2) as totalParticipants,
        (SELECT COUNT(*) FROM events WHERE MONTH(event_date) = MONTH(CURRENT_DATE()) AND YEAR(event_date) = YEAR(CURRENT_DATE())) as eventsThisMonth,
        (SELECT COUNT(*) FROM events) as totalEvents
    `)

    res.json({
      activeEvents: stats.activeEvents || 0,
      totalParticipants: stats.totalParticipants || 0,
      eventsThisMonth: stats.eventsThisMonth || 0,
      totalEvents: stats.totalEvents || 0
    })
  } catch (error) {
    console.error('Get public stats error:', error)
    res.status(500).json({ message: 'Failed to fetch public statistics' })
  }
}

// Get event by ID
export const getEventById = async (req, res) => {
  try {
    const { id } = req.params
    const [events] = await pool.query(`
      SELECT e.*, c.category_name, a.name as admin_name,
        (SELECT COUNT(*) FROM registrations r WHERE r.event_id = e.id AND r.status_id = 2) as registered_count
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
    console.log('=== CREATE EVENT REQUEST ===')
    console.log('Body:', req.body)
    console.log('File:', req.file)
    console.log('User ID:', req.user.id)

    const { title, description, location, quota, event_date, category_id } = req.body
    const admin_id = req.user.id
    // Sanitize banner: reject invalid values like '[object Object]'
    let banner = req.file ? `/uploads/events/${req.file.filename}` : (req.body.banner || null)
    if (banner && (typeof banner !== 'string' || banner === '[object Object]' || banner.startsWith('[object'))) {
      banner = null
    }

    // Validate input
    if (!title || !description || !location || !quota || !event_date) {
      return res.status(400).json({ message: 'Missing required fields' })
    }

    // Validate event date is in the future
    const eventDateObj = new Date(event_date)
    const now = new Date()
    now.setHours(0, 0, 0, 0)
    if (eventDateObj < now) {
      return res.status(400).json({ message: 'Event date must be in the future' })
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
    res.status(500).json({ message: error.message || 'Failed to create event' })
  }
}

// Update event (admin only)
export const updateEvent = async (req, res) => {
  try {
    const { id } = req.params
    const { title, description, location, quota, event_date } = req.body
    // Sanitize banner: reject invalid values like '[object Object]'
    let banner = req.file ? `/uploads/events/${req.file.filename}` : (req.body.banner || null)
    if (banner && (typeof banner !== 'string' || banner === '[object Object]' || banner.startsWith('[object'))) {
      banner = null
    }

    // Validate event date if provided
    if (event_date) {
      const eventDateObj = new Date(event_date)
      const now = new Date()
      now.setHours(0, 0, 0, 0)
      if (eventDateObj < now) {
        return res.status(400).json({ message: 'Event date must be in the future' })
      }
    }

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
    res.status(500).json({ message: error.message || 'Failed to update event' })
  }
}

// Get public schedules for an event
export const getPublicSchedules = async (req, res) => {
  try {
    const { id } = req.params
    const [schedules] = await pool.query(
      'SELECT * FROM schedules WHERE event_id = ? ORDER BY start_time',
      [id]
    )
    res.json(schedules)
  } catch (error) {
    console.error('Get schedules error:', error)
    res.status(500).json({ message: 'Failed to fetch schedules' })
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
    res.status(500).json({ message: error.message || 'Failed to delete event' })
  }
}

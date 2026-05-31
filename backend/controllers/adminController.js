import pool from '../config/database.js'
import { sendMail } from '../utils/mailer.js'

// Get dashboard statistics
const csvEscape = (value) => {
  if (value === null || value === undefined) return ''
  const str = String(value)
  return /[",\n\r]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str
}

export const getDashboardStats = async (req, res) => {
  try {
    const admin_id = req.user.id

    // Total events created by this admin
    const [totalEvents] = await pool.query(
      'SELECT COUNT(*) as total FROM events WHERE admin_id = ?',
      [admin_id]
    )

    // Total participants across all events
    const [totalParticipants] = await pool.query(
      `SELECT COUNT(*) as total FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE e.admin_id = ?`,
      [admin_id]
    )

    // Active events
    const [activeEvents] = await pool.query(
      `SELECT COUNT(*) as total FROM events 
       WHERE admin_id = ? AND event_date > NOW()`,
      [admin_id]
    )

    // Pending approvals
    const [pendingApprovals] = await pool.query(
      `SELECT COUNT(*) as total FROM registrations r
       JOIN events e ON r.event_id = e.id
       WHERE e.admin_id = ? AND r.status_id = 1`,
      [admin_id]
    )

    res.json({
      totalEvents: totalEvents[0].total,
      totalParticipants: totalParticipants[0].total,
      activeEvents: activeEvents[0].total,
      pendingApprovals: pendingApprovals[0].total
    })
  } catch (error) {
    console.error('Get stats error:', error)
    res.status(500).json({ message: 'Failed to fetch statistics' })
  }
}

// Get event registrations
export const getEventRegistrations = async (req, res) => {
  try {
    const { eventId } = req.params
    const admin_id = req.user.id

    // Verify admin owns event
    const [events] = await pool.query(
      'SELECT id FROM events WHERE id = ? AND admin_id = ?',
      [eventId, admin_id]
    )

    if (events.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const [registrations] = await pool.query(`
      SELECT r.id, r.user_id, r.registered_at, r.status_id,
             u.name as user_name, u.email as user_email,
             ps.status_name as status
      FROM registrations r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN participant_status ps ON r.status_id = ps.id
      WHERE r.event_id = ?
      ORDER BY r.registered_at DESC
    `, [eventId])

    res.json(registrations)
  } catch (error) {
    console.error('Get registrations error:', error)
    res.status(500).json({ message: 'Failed to fetch registrations' })
  }
}

// Update registration status
export const updateRegistrationStatus = async (req, res) => {
  try {
    const { registrationId } = req.params
    const { status } = req.body
    const admin_id = req.user.id

    // Map status to status_id
    let status_id = 1 // pending
    if (status === 'approved') status_id = 2
    if (status === 'rejected') status_id = 3

    // Verify admin owns event
    const [check] = await pool.query(`
      SELECT r.id, r.event_id, r.user_id, u.email as user_email, u.name as user_name, e.title as event_title FROM registrations r
      JOIN events e ON r.event_id = e.id
      JOIN users u ON r.user_id = u.id
      WHERE r.id = ? AND e.admin_id = ?
    `, [registrationId, admin_id])

    if (check.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    // Check quota before approving
    if (status === 'approved') {
      const [[quotaCheck]] = await pool.query(`
        SELECT e.quota,
          (SELECT COUNT(*) FROM registrations WHERE event_id = e.id AND status_id = 2) as approved_count
        FROM events e
        WHERE e.id = ?
      `, [check[0].event_id])

      if (quotaCheck && quotaCheck.approved_count >= quotaCheck.quota) {
        return res.status(400).json({ message: 'Event quota has been reached' })
      }
    }

    await pool.query(
      'UPDATE registrations SET status_id = ? WHERE id = ?',
      [status_id, registrationId]
    )

    sendMail({
      to: check[0].user_email,
      subject: status === 'approved' ? 'Pendaftaran Event Disetujui' : status === 'rejected' ? 'Pendaftaran Event Ditolak' : 'Status Pendaftaran Event Diperbarui',
      text: `Halo ${check[0].user_name}, status pendaftaran Anda untuk event "${check[0].event_title}" adalah ${status}.`,
      html: `<p>Halo <strong>${check[0].user_name}</strong>,</p><p>Status pendaftaran Anda untuk event <strong>${check[0].event_title}</strong> adalah <strong>${status}</strong>.</p>`
    }).catch(error => console.warn('Status email skipped:', error.message))

    try {
      await pool.query(
        `INSERT INTO notifications (user_id, title, message, type, created_at)
         VALUES (?, ?, ?, ?, NOW())`,
        [
          check[0].user_id,
          status === 'approved' ? 'Pendaftaran Disetujui' : status === 'rejected' ? 'Pendaftaran Ditolak' : 'Status Pendaftaran Diperbarui',
          `Status pendaftaran Anda untuk event "${check[0].event_title}" adalah ${status}.`,
          status
        ]
      )
    } catch (notificationError) {
      console.warn('Notification insert skipped:', notificationError.message)
    }

    res.json({ message: 'Status updated successfully' })
  } catch (error) {
    console.error('Update status error:', error)
    res.status(500).json({ message: 'Failed to update status' })
  }
}

// Export admin report as CSV
export const exportAdminReport = async (req, res) => {
  try {
    const admin_id = req.user.id
    const format = (req.query.format || 'csv').toLowerCase()

    const [rows] = await pool.query(`
      SELECT
        e.id as event_id,
        e.title as event_title,
        c.category_name,
        e.location,
        e.quota,
        e.event_date,
        COUNT(r.id) as total_registrations,
        SUM(CASE WHEN r.status_id = 1 THEN 1 ELSE 0 END) as pending_count,
        SUM(CASE WHEN r.status_id = 2 THEN 1 ELSE 0 END) as approved_count,
        SUM(CASE WHEN r.status_id = 3 THEN 1 ELSE 0 END) as rejected_count
      FROM events e
      LEFT JOIN event_categories c ON e.category_id = c.id
      LEFT JOIN registrations r ON r.event_id = e.id
      WHERE e.admin_id = ?
      GROUP BY e.id, e.title, c.category_name, e.location, e.quota, e.event_date
      ORDER BY e.event_date DESC
    `, [admin_id])

    const generatedAt = new Date().toISOString()

    if (format === 'json') {
      return res.json({ generatedAt, data: rows })
    }

    const headers = [
      'Event ID',
      'Judul Event',
      'Kategori',
      'Lokasi',
      'Kuota',
      'Tanggal Event',
      'Total Registrasi',
      'Pending',
      'Approved',
      'Rejected'
    ]

    const csv = [
      `Event Hub Admin Report`,
      `Generated At,${csvEscape(generatedAt)}`,
      '',
      headers.map(csvEscape).join(','),
      ...rows.map(row => [
        row.event_id,
        row.event_title,
        row.category_name,
        row.location,
        row.quota,
        row.event_date,
        row.total_registrations || 0,
        row.pending_count || 0,
        row.approved_count || 0,
        row.rejected_count || 0
      ].map(csvEscape).join(','))
    ].join('\n')

    res.setHeader('Content-Type', 'text/csv; charset=utf-8')
    res.setHeader('Content-Disposition', `attachment; filename="event-hub-report-${new Date().toISOString().slice(0, 10)}.csv"`)
    res.send(csv)
  } catch (error) {
    console.error('Export report error:', error)
    res.status(500).json({ message: 'Failed to export report' })
  }
}

// Get event schedules
export const getEventSchedules = async (req, res) => {
  try {
    const { eventId } = req.params
    const admin_id = req.user.id

    // Verify admin owns event
    const [events] = await pool.query(
      'SELECT id FROM events WHERE id = ? AND admin_id = ?',
      [eventId, admin_id]
    )

    if (events.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const [schedules] = await pool.query(
      'SELECT * FROM schedules WHERE event_id = ? ORDER BY start_time',
      [eventId]
    )

    res.json(schedules)
  } catch (error) {
    console.error('Get schedules error:', error)
    res.status(500).json({ message: 'Failed to fetch schedules' })
  }
}

// Create schedule
export const createSchedule = async (req, res) => {
  try {
    const { eventId } = req.params
    const { activity_name, start_time, end_time } = req.body
    const admin_id = req.user.id

    // Verify admin owns event
    const [events] = await pool.query(
      'SELECT id FROM events WHERE id = ? AND admin_id = ?',
      [eventId, admin_id]
    )

    if (events.length === 0) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    const [result] = await pool.query(
      'INSERT INTO schedules (event_id, activity_name, start_time, end_time, created_at) VALUES (?, ?, ?, ?, NOW())',
      [eventId, activity_name, start_time, end_time]
    )

    res.status(201).json({
      message: 'Schedule created successfully',
      scheduleId: result.insertId
    })
  } catch (error) {
    console.error('Create schedule error:', error)
    res.status(500).json({ message: 'Failed to create schedule' })
  }
}

// Update schedule
export const updateSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params
    const { activity_name, start_time, end_time } = req.body
    const admin_id = req.user.id

    const [result] = await pool.query(
      `UPDATE schedules SET activity_name=?, start_time=?, end_time=?
       WHERE id=? AND event_id IN (SELECT id FROM events WHERE admin_id=?)`,
      [activity_name, start_time, end_time, scheduleId, admin_id]
    )

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    res.json({ message: 'Schedule updated successfully' })
  } catch (error) {
    console.error('Update schedule error:', error)
    res.status(500).json({ message: 'Failed to update schedule' })
  }
}

// Delete schedule
export const deleteSchedule = async (req, res) => {
  try {
    const { scheduleId } = req.params
    const admin_id = req.user.id

    const [result] = await pool.query(
      `DELETE FROM schedules
       WHERE id=? AND event_id IN (SELECT id FROM events WHERE admin_id=?)`,
      [scheduleId, admin_id]
    )

    if (result.affectedRows === 0) {
      return res.status(403).json({ message: 'Unauthorized' })
    }

    res.json({ message: 'Schedule deleted successfully' })
  } catch (error) {
    console.error('Delete schedule error:', error)
    res.status(500).json({ message: 'Failed to delete schedule' })
  }
}

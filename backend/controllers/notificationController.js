import pool from '../config/database.js'

export const getMyNotifications = async (req, res) => {
  try {
    const isAdmin = req.user.role === 'admin'
    const column = isAdmin ? 'admin_id' : 'user_id'

    const [notifications] = await pool.query(
      `SELECT id, title, message, type, is_read, created_at
       FROM notifications
       WHERE ${column} = ?
       ORDER BY created_at DESC
       LIMIT 50`,
      [req.user.id]
    )

    res.json({ data: notifications })
  } catch (error) {
    console.error('Get notifications error:', error)
    res.status(500).json({ message: 'Failed to fetch notifications' })
  }
}

export const markNotificationRead = async (req, res) => {
  try {
    const { id } = req.params
    const isAdmin = req.user.role === 'admin'
    const column = isAdmin ? 'admin_id' : 'user_id'

    const [result] = await pool.query(
      `UPDATE notifications SET is_read = 1 WHERE id = ? AND ${column} = ?`,
      [id, req.user.id]
    )

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Notification not found' })
    }

    res.json({ message: 'Notification marked as read' })
  } catch (error) {
    console.error('Mark notification error:', error)
    res.status(500).json({ message: 'Failed to update notification' })
  }
}

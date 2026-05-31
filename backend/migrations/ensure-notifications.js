import pool from '../config/database.js'

const run = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT,
        admin_id INT,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read TINYINT(1) DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
      )
    `)

    const indexes = [
      ['idx_notifications_user_id', 'user_id'],
      ['idx_notifications_admin_id', 'admin_id']
    ]

    for (const [indexName, columnName] of indexes) {
      try {
        await pool.query(`CREATE INDEX ${indexName} ON notifications(${columnName})`)
      } catch (error) {
        if (error.code !== 'ER_DUP_KEYNAME') throw error
      }
    }

    console.log('✓ Notifications table ready')
  } catch (error) {
    console.error('✗ Failed to prepare notifications table:', error.message)
    process.exitCode = 1
  } finally {
    await pool.end()
  }
}

run()

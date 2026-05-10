import pool from './config/database.js'
import dotenv from 'dotenv'

dotenv.config()

const initDatabase = async () => {
  let connection
  try {
    connection = await pool.getConnection()
    
    // Create all tables with correct schema
    await connection.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ admins table created')
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        photo VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ users table created')
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS event_categories (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category_name VARCHAR(100) NOT NULL UNIQUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)
    console.log('✓ event_categories table created')
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS events (
        id INT PRIMARY KEY AUTO_INCREMENT,
        category_id INT,
        admin_id INT NOT NULL,
        title VARCHAR(255) NOT NULL,
        description LONGTEXT,
        banner VARCHAR(255),
        location VARCHAR(255) NOT NULL,
        quota INT NOT NULL,
        event_date DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (category_id) REFERENCES event_categories(id) ON DELETE SET NULL,
        FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
      )
    `)
    console.log('✓ events table created')
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS schedules (
        id INT PRIMARY KEY AUTO_INCREMENT,
        event_id INT NOT NULL,
        activity_name VARCHAR(255) NOT NULL,
        start_time DATETIME NOT NULL,
        end_time DATETIME NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE
      )
    `)
    console.log('✓ schedules table created')
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS participant_status (
        id INT PRIMARY KEY AUTO_INCREMENT,
        status_name VARCHAR(50) NOT NULL UNIQUE
      )
    `)
    console.log('✓ participant_status table created')
    
    await connection.query(`
      CREATE TABLE IF NOT EXISTS registrations (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        event_id INT NOT NULL,
        status_id INT DEFAULT 1,
        registered_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (event_id) REFERENCES events(id) ON DELETE CASCADE,
        FOREIGN KEY (status_id) REFERENCES participant_status(id) ON DELETE SET NULL,
        UNIQUE KEY unique_registration (user_id, event_id)
      )
    `)
    console.log('✓ registrations table created')
    
    // Insert default data
    await connection.query(`
      INSERT IGNORE INTO participant_status (id, status_name) VALUES 
      (1, 'pending'),
      (2, 'approved'),
      (3, 'rejected')
    `)
    console.log('✓ Default participant status inserted')
    
    await connection.query(`
      INSERT IGNORE INTO event_categories (category_name) VALUES 
      ('Workshop'),
      ('Seminar'),
      ('Conference'),
      ('Networking'),
      ('Competition'),
      ('Cultural Event'),
      ('Sports'),
      ('Career Fair'),
      ('Social'),
      ('Other')
    `)
    console.log('✓ Default categories inserted')
    
    // Create indexes
    try {
      await connection.query('CREATE INDEX idx_events_admin_id ON events(admin_id)')
      await connection.query('CREATE INDEX idx_events_category_id ON events(category_id)')
      await connection.query('CREATE INDEX idx_events_event_date ON events(event_date)')
      await connection.query('CREATE INDEX idx_schedules_event_id ON schedules(event_id)')
      await connection.query('CREATE INDEX idx_registrations_user_id ON registrations(user_id)')
      await connection.query('CREATE INDEX idx_registrations_event_id ON registrations(event_id)')
      await connection.query('CREATE INDEX idx_registrations_status_id ON registrations(status_id)')
      await connection.query('CREATE INDEX idx_users_email ON users(email)')
      await connection.query('CREATE INDEX idx_admins_email ON admins(email)')
      console.log('✓ Indexes created')
    } catch (e) {
      console.log('⚠ Indexes already exist or error creating')
    }
    
    console.log('\n✓ Database schema created successfully!')
    process.exit(0)
  } catch (error) {
    console.error('✗ Error creating schema:', error.message)
    process.exit(1)
  } finally {
    if (connection) connection.release()
  }
}

initDatabase()

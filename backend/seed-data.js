import pool from './config/database.js'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

dotenv.config()

const seedData = async () => {
  let connection
  try {
    connection = await pool.getConnection()
    
    // Create admin user
    const adminPassword = await bcrypt.hash('admin123', 10)
    await connection.query(
      'INSERT INTO admins (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
      ['Admin', 'admin@campus.com', adminPassword]
    )
    console.log('✓ Admin user created (admin@campus.com / admin123)')
    
    // Create sample users
    const userPassword = await bcrypt.hash('user123', 10)
    const users = [
      ['Budi Santoso', 'budi@student.com', userPassword],
      ['Siti Nurhaliza', 'siti@student.com', userPassword],
      ['Ahmad Wijaya', 'ahmad@student.com', userPassword],
      ['Rina Kartini', 'rina@student.com', userPassword],
      ['Doni Hermawan', 'doni@student.com', userPassword],
    ]
    
    for (const [name, email, password] of users) {
      await connection.query(
        'INSERT INTO users (name, email, password, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [name, email, password]
      )
    }
    console.log('✓ 5 sample users created')
    
    // Create sample events
    const events = [
      {
        title: 'Web Development Workshop 2024',
        description: 'Learn modern web development with React, Node.js, and MongoDB. This workshop covers frontend and backend development best practices.',
        location: 'Room 101, Building A',
        quota: 100,
        event_date: '2026-05-20 09:00:00',
        category_id: 1,
        banner: 'workshop.jpg'
      },
      {
        title: 'AI & Machine Learning Seminar',
        description: 'Explore the future of Artificial Intelligence and Machine Learning. Industry experts will share insights on AI applications and trends.',
        location: 'Main Auditorium, Building B',
        quota: 200,
        event_date: '2026-06-15 10:00:00',
        category_id: 2,
        banner: 'ai-seminar.jpg'
      },
      {
        title: 'Mobile App Development Conference',
        description: 'Join us for a comprehensive conference on mobile app development using Flutter and React Native. Learn from industry leaders.',
        location: 'Convention Center',
        quota: 150,
        event_date: '2026-07-01 08:00:00',
        category_id: 3,
        banner: 'mobile-conference.jpg'
      },
      {
        title: 'Startup Networking Event',
        description: 'Connect with fellow entrepreneurs and investors. This networking event is perfect for startup founders and business enthusiasts.',
        location: 'Innovation Hub, Floor 5',
        quota: 80,
        event_date: '2026-05-25 18:00:00',
        category_id: 4,
        banner: 'networking.jpg'
      },
      {
        title: 'Cloud Computing Workshop',
        description: 'Master cloud computing with AWS, Google Cloud, and Azure. Learn about deployment, scaling, and managing cloud infrastructure.',
        location: 'Lab 203, Building C',
        quota: 60,
        event_date: '2026-06-10 14:00:00',
        category_id: 1,
        banner: 'cloud-workshop.jpg'
      },
      {
        title: 'Data Science & Analytics Bootcamp',
        description: 'Intensive bootcamp on data science, Python, and data analytics. Hands-on sessions with real-world datasets and projects.',
        location: 'Data Lab, Building D',
        quota: 45,
        event_date: '2026-06-20 09:00:00',
        category_id: 2,
        banner: 'data-science.jpg'
      },
      {
        title: 'UI/UX Design Competition',
        description: 'Showcase your design skills in our UI/UX design competition. Win prizes and get recognized by industry professionals.',
        location: 'Design Studio, Floor 2',
        quota: 50,
        event_date: '2026-07-10 10:00:00',
        category_id: 5,
        banner: 'design-competition.jpg'
      },
      {
        title: 'Campus Cultural Festival 2024',
        description: 'Celebrate diversity and culture with performances, food, and entertainment from around the world.',
        location: 'Campus Grounds',
        quota: 500,
        event_date: '2026-05-30 16:00:00',
        category_id: 6,
        banner: 'cultural-festival.jpg'
      },
    ]
    
    for (const event of events) {
      await connection.query(
        'INSERT INTO events (category_id, admin_id, title, description, banner, location, quota, event_date, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())',
        [event.category_id, 1, event.title, event.description, event.banner, event.location, event.quota, event.event_date]
      )
    }
    console.log('✓ 8 sample events created')
    
    // Create sample registrations
    const registrations = [
      [1, 1, 2], // user 1 approved for event 1
      [1, 2, 2], // user 1 approved for event 2
      [2, 1, 2], // user 2 approved for event 1
      [2, 3, 2], // user 2 approved for event 3
      [3, 1, 1], // user 3 pending for event 1
      [3, 4, 2], // user 3 approved for event 4
      [4, 2, 2], // user 4 approved for event 2
      [4, 5, 1], // user 4 pending for event 5
      [5, 3, 2], // user 5 approved for event 3
      [5, 6, 2], // user 5 approved for event 6
    ]
    
    for (const [user_id, event_id, status_id] of registrations) {
      try {
        await connection.query(
          'INSERT INTO registrations (user_id, event_id, status_id, registered_at) VALUES (?, ?, ?, NOW())',
          [user_id, event_id, status_id]
        )
      } catch (e) {
        // Skip if duplicate registration
      }
    }
    console.log('✓ 10 sample registrations created')
    
    console.log('\n✓ All sample data inserted successfully!')
    process.exit(0)
  } catch (error) {
    console.error('✗ Error inserting data:', error.message)
    process.exit(1)
  } finally {
    if (connection) connection.release()
  }
}

seedData()

# Sample Data for Campus Event Management System

-- Insert sample admin
INSERT INTO admins (name, email, password, created_at, updated_at) VALUES 
('Dr. John Administrator', 'admin@campus.com', '$2a$10$W.3.A6.J0l2D4F8E9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7', NOW(), NOW());

-- Insert sample users
INSERT INTO users (name, email, password, created_at, updated_at) VALUES 
('Alice Johnson', 'alice@student.com', '$2a$10$W.3.A6.J0l2D4F8E9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7', NOW(), NOW()),
('Bob Smith', 'bob@student.com', '$2a$10$W.3.A6.J0l2D4F8E9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7', NOW(), NOW()),
('Charlie Davis', 'charlie@student.com', '$2a$10$W.3.A6.J0l2D4F8E9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7', NOW(), NOW()),
('Diana Wilson', 'diana@student.com', '$2a$10$W.3.A6.J0l2D4F8E9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7', NOW(), NOW()),
('Eve Martinez', 'eve@student.com', '$2a$10$W.3.A6.J0l2D4F8E9G0H1I2J3K4L5M6N7O8P9Q0R1S2T3U4V5W6X7', NOW(), NOW());

-- Insert sample events
INSERT INTO events (category_id, admin_id, title, description, location, quota, event_date, created_at, updated_at) VALUES 
(1, 1, 'Web Development Workshop', 'Learn modern web development with React and Node.js', 'Room 101, IT Building', 50, DATE_ADD(NOW(), INTERVAL 7 DAY), NOW(), NOW()),
(2, 1, 'Industry Seminar 2024', 'Meet with tech leaders and learn about latest trends', 'Main Auditorium', 200, DATE_ADD(NOW(), INTERVAL 14 DAY), NOW(), NOW()),
(4, 1, 'Tech Networking Event', 'Connect with professionals and peers in tech industry', 'Student Center Hall A', 100, DATE_ADD(NOW(), INTERVAL 21 DAY), NOW(), NOW()),
(5, 1, 'Coding Competition', 'Compete with peers in algorithm challenges', 'Computer Lab 1', 30, DATE_ADD(NOW(), INTERVAL 30 DAY), NOW(), NOW()),
(1, 1, 'Database Design Masterclass', 'Advanced database design patterns and optimization', 'Room 205, IT Building', 40, DATE_ADD(NOW(), INTERVAL 10 DAY), NOW(), NOW());

-- Insert sample schedules
INSERT INTO schedules (event_id, activity_name, start_time, end_time, created_at) VALUES 
(1, 'Introduction to React', DATE_ADD(NOW(), INTERVAL 7 DAY), DATE_ADD(NOW(), INTERVAL 7 DAY + INTERVAL 1 HOUR), NOW()),
(1, 'React Hooks Deep Dive', DATE_ADD(NOW(), INTERVAL 7 DAY + INTERVAL 1 HOUR), DATE_ADD(NOW(), INTERVAL 7 DAY + INTERVAL 2 HOUR), NOW()),
(1, 'Q&A Session', DATE_ADD(NOW(), INTERVAL 7 DAY + INTERVAL 2 HOUR), DATE_ADD(NOW(), INTERVAL 7 DAY + INTERVAL 2.5 HOUR), NOW()),
(2, 'Opening Remarks', DATE_ADD(NOW(), INTERVAL 14 DAY), DATE_ADD(NOW(), INTERVAL 14 DAY + INTERVAL 30 MINUTE), NOW()),
(2, 'Panel Discussion', DATE_ADD(NOW(), INTERVAL 14 DAY + INTERVAL 30 MINUTE), DATE_ADD(NOW(), INTERVAL 14 DAY + INTERVAL 1.5 HOUR), NOW());

-- Insert sample registrations
INSERT INTO registrations (user_id, event_id, status_id, registered_at) VALUES 
(1, 1, 2, NOW()),  -- approved
(1, 2, 1, NOW()),  -- pending
(2, 1, 2, NOW()),  -- approved
(2, 3, 1, NOW()),  -- pending
(3, 2, 2, NOW()),  -- approved
(3, 4, 1, NOW()),  -- pending
(4, 1, 2, NOW()),  -- approved
(4, 3, 2, NOW()),  -- approved
(5, 2, 1, NOW()),  -- pending
(5, 5, 2, NOW());  -- approved

-- Sample admin credentials for testing:
-- Email: admin@campus.com
-- Password: password (change this in production)

-- Sample user credentials for testing:
-- Email: alice@student.com
-- Password: password (change these in production)

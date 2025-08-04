-- YatraTrack Database Setup Script
-- Run this script in your MySQL client to create the database and tables

-- Create the database
CREATE DATABASE IF NOT EXISTS yatra_track;

-- Use the database
USE yatra_track;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create yatras table with enhanced features
CREATE TABLE IF NOT EXISTS yatras (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    category ENUM('business', 'leisure', 'adventure', 'family', 'romantic', 'educational', 'other') DEFAULT 'leisure',
    destination VARCHAR(255),
    date DATE NOT NULL,
    budget DECIMAL(10,2) DEFAULT 0.00,
    status ENUM('planned', 'in_progress', 'completed', 'cancelled') DEFAULT 'planned',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Create travel companions table
CREATE TABLE IF NOT EXISTS travel_companions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    yatra_id INT NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    relationship VARCHAR(100),
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (yatra_id) REFERENCES yatras(id) ON DELETE CASCADE
);

-- Create indexes for better performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_yatras_user_id ON yatras(user_id);
CREATE INDEX idx_yatras_date ON yatras(date);
CREATE INDEX idx_yatras_category ON yatras(category);
CREATE INDEX idx_yatras_status ON yatras(status);
CREATE INDEX idx_companions_yatra_id ON travel_companions(yatra_id);

-- Migration script for existing databases
-- Run these ALTER TABLE statements if you have an existing database

-- Add new columns to existing yatras table (run only if columns don't exist)
-- ALTER TABLE yatras ADD COLUMN IF NOT EXISTS category ENUM('business', 'leisure', 'adventure', 'family', 'romantic', 'educational', 'other') DEFAULT 'leisure' AFTER description;
-- ALTER TABLE yatras ADD COLUMN IF NOT EXISTS destination VARCHAR(255) AFTER category;
-- ALTER TABLE yatras ADD COLUMN IF NOT EXISTS budget DECIMAL(10,2) DEFAULT 0.00 AFTER date;
-- ALTER TABLE yatras ADD COLUMN IF NOT EXISTS status ENUM('planned', 'in_progress', 'completed', 'cancelled') DEFAULT 'planned' AFTER budget;

-- Insert sample data (optional)
-- You can uncomment these lines to add sample data for testing

-- INSERT INTO users (name, email, password) VALUES 
-- ('John Doe', 'john@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ6Kz6O'), -- Password: Password123
-- ('Jane Smith', 'jane@example.com', '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj4tbQJ6Kz6O'); -- Password: Password123

-- INSERT INTO yatras (user_id, title, description, category, destination, date, budget, status) VALUES 
-- (1, 'Trip to Paris', 'Weekend getaway to the City of Light', 'leisure', 'Paris, France', '2024-06-15', 2500.00, 'planned'),
-- (1, 'Beach Vacation', 'Relaxing beach vacation in Bali', 'leisure', 'Bali, Indonesia', '2024-07-20', 1800.00, 'planned'),
-- (2, 'Mountain Hiking', 'Adventure hiking in the Alps', 'adventure', 'Swiss Alps', '2024-08-10', 1200.00, 'planned'),
-- (1, 'Business Conference', 'Annual tech conference', 'business', 'San Francisco, CA', '2024-09-05', 3000.00, 'planned'),
-- (2, 'Family Reunion', 'Summer family gathering', 'family', 'Grand Canyon', '2024-10-15', 800.00, 'planned');

-- INSERT INTO travel_companions (yatra_id, name, email, relationship, phone) VALUES 
-- (1, 'Sarah Johnson', 'sarah@example.com', 'friend', '+1-555-0123'),
-- (1, 'Mike Chen', 'mike@example.com', 'friend', '+1-555-0124'),
-- (2, 'Emma Wilson', 'emma@example.com', 'partner', '+1-555-0125'),
-- (3, 'Alex Rodriguez', 'alex@example.com', 'colleague', '+1-555-0126'),
-- (4, 'Lisa Thompson', 'lisa@example.com', 'colleague', '+1-555-0127'),
-- (5, 'David Brown', 'david@example.com', 'family', '+1-555-0128'),
-- (5, 'Maria Garcia', 'maria@example.com', 'family', '+1-555-0129');

-- Show the created tables
SHOW TABLES;

-- Show table structure
DESCRIBE users;
DESCRIBE yatras;

-- Show sample data (if inserted)
-- SELECT * FROM users;
-- SELECT * FROM yatras; 
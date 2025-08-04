# YatraTrack - Enhanced Travel Planning Application

A full-stack web application for planning and managing travel routes or events with advanced features. Built with React, Node.js, Express, and MySQL.

## 🚀 Features

### **Core Features**
- **User Authentication**: Secure registration and login with JWT tokens
- **Yatra Management**: Create, read, update, and delete travel events
- **Modern UI**: Beautiful, responsive design with smooth animations
- **Real-time Validation**: Client and server-side form validation
- **Security**: Password hashing, SQL injection prevention, and input sanitization

### **Enhanced Travel Features** ✨
- **Travel Categories**: Organize trips by type (Business, Leisure, Adventure, Family, Romantic, Educational)
- **Destination Tracking**: Add specific destinations to your trips
- **Budget Management**: Track and manage trip budgets
- **Trip Status**: Monitor trip progress (Planned, In Progress, Completed, Cancelled)
- **Travel Companions**: Add friends, family, or colleagues to your trips
- **Advanced Filtering**: Filter trips by category and status
- **Enhanced Statistics**: View comprehensive travel analytics

### **Travel Companions System** 👥
- **Add Companions**: Include friends, family, or colleagues in your trips
- **Relationship Tracking**: Categorize companions (Family, Friend, Colleague, Partner)
- **Contact Information**: Store email and phone numbers for easy communication
- **Companion Management**: Edit or remove companions as needed

## 🛠️ Tech Stack

### Frontend
- React 18
- React Router DOM
- Axios for API calls
- React Hot Toast for notifications
- Lucide React for icons
- Date-fns for date formatting

### Backend
- Node.js
- Express.js
- MySQL2 for database
- bcryptjs for password hashing
- JWT for authentication
- Express Validator for input validation
- Helmet for security headers

### Database
- MySQL with enhanced schema
- Travel companions support
- Optimized indexes for performance

## 📋 Prerequisites

- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Yatra-track
```

### 2. Install Dependencies

```bash
# Install all dependencies (root, server, and client)
npm run install-all
```

### 3. Database Setup

1. Create a MySQL database:
```sql
CREATE DATABASE yatra_track;
```

2. Copy the environment template:
```bash
cd server
cp env.example .env
```

3. Update the `.env` file with your database credentials:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=yatra_track
DB_PORT=3306

# JWT Configuration
JWT_SECRET=your_jwt_secret_key_here_make_it_long_and_random
JWT_EXPIRES_IN=24h

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 4. Run Database Migration (New Feature!)

If you have an existing database, run the migration to add new features:

```bash
npm run migrate
```

This will add:
- Travel categories
- Destination tracking
- Budget management
- Trip status tracking
- Travel companions table

### 5. Start the Application

```bash
# Start both server and client (from root directory)
npm run dev

# Or start them separately:
# Terminal 1 - Start server
npm run server

# Terminal 2 - Start client
npm run client
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## 📚 Enhanced API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "Password123"
}
```

### Enhanced Yatra Endpoints

#### Create Yatra (Enhanced)
```http
POST /api/yatra
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Trip to Paris",
  "description": "Weekend getaway to the City of Light",
  "category": "leisure",
  "destination": "Paris, France",
  "date": "2024-06-15",
  "budget": 2500.00,
  "status": "planned"
}
```

#### Get All Yatras
```http
GET /api/yatra
Authorization: Bearer <token>
```

#### Update Yatra
```http
PUT /api/yatra/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Trip to Paris",
  "description": "Updated description",
  "category": "romantic",
  "destination": "Paris, France",
  "date": "2024-06-20",
  "budget": 3000.00,
  "status": "in_progress"
}
```

### Travel Companions Endpoints (New!)

#### Add Travel Companion
```http
POST /api/yatra/:yatraId/companions
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sarah Johnson",
  "email": "sarah@example.com",
  "relationship": "friend",
  "phone": "+1-555-0123"
}
```

#### Get Travel Companions
```http
GET /api/yatra/:yatraId/companions
Authorization: Bearer <token>
```

#### Update Travel Companion
```http
PUT /api/yatra/:yatraId/companions/:companionId
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Sarah Johnson",
  "email": "sarah.updated@example.com",
  "relationship": "family",
  "phone": "+1-555-0124"
}
```

#### Delete Travel Companion
```http
DELETE /api/yatra/:yatraId/companions/:companionId
Authorization: Bearer <token>
```

## 🎯 New Features Guide

### **Enhanced Yatra Creation**
1. **Categories**: Choose from Business, Leisure, Adventure, Family, Romantic, Educational, or Other
2. **Destinations**: Add specific locations for your trips
3. **Budget Tracking**: Set and monitor trip budgets
4. **Status Management**: Track trip progress from planning to completion

### **Travel Companions**
1. **Add Companions**: Click the "Users" icon on any yatra card
2. **Manage Information**: Add names, relationships, emails, and phone numbers
3. **Edit/Remove**: Update companion details or remove them as needed
4. **Relationship Types**: Categorize as Family, Friend, Colleague, Partner, or Other

### **Advanced Filtering**
1. **Category Filter**: Filter trips by travel category
2. **Status Filter**: View trips by their current status
3. **Enhanced Statistics**: See total budget, upcoming trips, completed trips, and more

## 🧪 Testing with Postman

### 1. Import the enhanced collection:

```json
{
  "info": {
    "name": "YatraTrack Enhanced API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Auth",
      "item": [
        {
          "name": "Register",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Test User\",\n  \"email\": \"test@example.com\",\n  \"password\": \"Password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/register",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "register"]
            }
          }
        },
        {
          "name": "Login",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"email\": \"test@example.com\",\n  \"password\": \"Password123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/auth/login",
              "host": ["{{baseUrl}}"],
              "path": ["api", "auth", "login"]
            }
          }
        }
      ]
    },
    {
      "name": "Enhanced Yatra",
      "item": [
        {
          "name": "Create Enhanced Yatra",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"title\": \"Enhanced Trip\",\n  \"description\": \"Test description with new features\",\n  \"category\": \"leisure\",\n  \"destination\": \"Bali, Indonesia\",\n  \"date\": \"2024-12-25\",\n  \"budget\": 2000.00,\n  \"status\": \"planned\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/yatra",
              "host": ["{{baseUrl}}"],
              "path": ["api", "yatra"]
            }
          }
        },
        {
          "name": "Get All Yatras",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/yatra",
              "host": ["{{baseUrl}}"],
              "path": ["api", "yatra"]
            }
          }
        }
      ]
    },
    {
      "name": "Travel Companions",
      "item": [
        {
          "name": "Add Companion",
          "request": {
            "method": "POST",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              },
              {
                "key": "Content-Type",
                "value": "application/json"
              }
            ],
            "body": {
              "mode": "raw",
              "raw": "{\n  \"name\": \"Sarah Johnson\",\n  \"email\": \"sarah@example.com\",\n  \"relationship\": \"friend\",\n  \"phone\": \"+1-555-0123\"\n}"
            },
            "url": {
              "raw": "{{baseUrl}}/api/yatra/1/companions",
              "host": ["{{baseUrl}}"],
              "path": ["api", "yatra", "1", "companions"]
            }
          }
        },
        {
          "name": "Get Companions",
          "request": {
            "method": "GET",
            "header": [
              {
                "key": "Authorization",
                "value": "Bearer {{token}}"
              }
            ],
            "url": {
              "raw": "{{baseUrl}}/api/yatra/1/companions",
              "host": ["{{baseUrl}}"],
              "path": ["api", "yatra", "1", "companions"]
            }
          }
        }
      ]
    }
  ],
  "variable": [
    {
      "key": "baseUrl",
      "value": "http://localhost:5000"
    },
    {
      "key": "token",
      "value": ""
    }
  ]
}
```

### 2. Set up environment variables:
- `baseUrl`: http://localhost:5000
- `token`: (will be set after login)

### 3. Testing flow:
1. Run the Register request to create a user
2. Run the Login request and copy the token from the response
3. Set the `token` environment variable with the copied token
4. Test the enhanced Yatra endpoints
5. Test the Travel Companions endpoints

## 📁 Enhanced Project Structure

```
Yatra-track/
├── client/                 # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── YatraForm.js
│   │   │   ├── CompanionForm.js    # New!
│   │   │   └── CompanionsList.js   # New!
│   │   ├── context/        # React context
│   │   └── App.js
│   └── package.json
├── server/                 # Node.js backend
│   ├── config/            # Database configuration
│   ├── controllers/       # Route controllers
│   ├── middleware/        # Custom middleware
│   ├── routes/           # API routes
│   ├── server.js         # Main server file
│   └── package.json
├── migrate-database.js    # New! Database migration script
├── database-setup.sql     # Enhanced database schema
├── package.json           # Root package.json
└── README.md
```

## 🔧 Available Scripts

### Root Directory
- `npm run dev` - Start both server and client in development mode
- `npm run server` - Start only the server
- `npm run client` - Start only the client
- `npm run install-all` - Install dependencies for all packages
- `npm run build` - Build the React app for production
- `npm run migrate` - Run database migration for new features

### Server Directory
- `npm run dev` - Start server with nodemon
- `npm start` - Start server in production mode

### Client Directory
- `npm start` - Start React development server
- `npm run build` - Build for production
- `npm test` - Run tests

## 🔒 Security Features

- **Password Hashing**: bcryptjs with 12 salt rounds
- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Server-side validation with express-validator
- **SQL Injection Prevention**: Parameterized queries with mysql2
- **CORS Protection**: Configured CORS with specific origins
- **Security Headers**: Helmet.js for security headers
- **Input Sanitization**: Automatic input sanitization and escaping

## 🚀 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your environment variables
2. Use a process manager like PM2
3. Set up a reverse proxy (nginx)
4. Use environment variables for sensitive data
5. Run database migration: `npm run migrate`

### Frontend Deployment
1. Run `npm run build` in the client directory
2. Serve the `build` folder with a static file server
3. Configure your server to handle React Router

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

If you encounter any issues or have questions, please:
1. Check the existing issues
2. Create a new issue with detailed information
3. Include error messages and steps to reproduce

## 🎉 What's New in This Version

### ✨ **Major Enhancements**
- **Travel Categories**: Organize trips by type with color-coded badges
- **Destination Tracking**: Add specific locations to your trips
- **Budget Management**: Track and monitor trip expenses
- **Trip Status**: Monitor progress from planning to completion
- **Travel Companions**: Add and manage travel partners
- **Advanced Filtering**: Filter trips by category and status
- **Enhanced Statistics**: Comprehensive travel analytics

### 🔧 **Technical Improvements**
- **Database Migration**: Safe migration script for existing databases
- **Enhanced API**: New endpoints for travel companions
- **Improved UI**: Better visual design with status indicators
- **Performance**: Optimized database indexes
- **Validation**: Enhanced form validation for new fields

---

**Happy Travel Planning! 🗺️✈️👥** 
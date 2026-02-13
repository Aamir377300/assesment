# Backend - Task Management API

## Quick Start

```bash
# Install dependencies
npm install

# Setup environment
cp .env.example .env
# Edit .env with your configuration

# Start development server
npm run dev

# Start production server
npm start
```

## Environment Variables

```env
NODE_ENV=development
PORT=5002
MONGODB_URI=mongodb://localhost:27017/task_management
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d
```

## API Documentation

Once the server is running, access Swagger documentation at:
```
http://localhost:5002/api-docs
```

## Project Structure

```
src/
├── config/          # Configuration files (DB, Swagger)
├── controllers/     # Request handlers
├── middleware/      # Custom middleware (auth, validation, error handling)
├── models/          # Mongoose schemas
├── routes/          # API routes
├── utils/           # Utility functions
├── app.js           # Express app configuration
└── server.js        # Server entry point
```

## Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon

## Key Features

- JWT Authentication
- Role-Based Access Control
- Input Validation
- Centralized Error Handling
- API Versioning
- Swagger Documentation
- MongoDB Integration

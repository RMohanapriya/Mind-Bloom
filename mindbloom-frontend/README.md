Mind-Bloom
This is a full-stack mental wellness application.

Overview
Mind-Bloom is a journaling app with an AI companion that provides sentiment analysis and actionable advice. The application is built using a modern, decoupled architecture:

Frontend: Next.js (React)

Backend: Node.js with Express.js

Database: MongoDB Atlas

Getting Started
Follow these steps to set up the project locally.

Prerequisites
Node.js (v18 or higher)

npm (or Yarn)

MongoDB Atlas account

Git

1. Backend Setup
Navigate to the mindbloom-backend folder.

Install dependencies:

npm install

Create a .env file and add your database and JWT secrets:

MONGO_URI="mongodb+srv://<username>:<password>@<cluster-url>/<dbname>?retryWrites=true&w=majority"
JWT_SECRET="YOUR_VERY_LONG_AND_RANDOM_SECRET_KEY"

Start the backend server:

node server.js

2. Frontend Setup
Navigate to the mindbloom-frontend folder.

Install dependencies:

npm install

Create a .env.local file and add your backend URL for local development:

NEXT_PUBLIC_BACKEND_URL="http://localhost:5000"

Start the frontend development server:

npm run dev

Deployment
This project is configured for continuous deployment to Netlify (for the frontend) and Render (for the backend).
BookShelf-System

Overview
The Bookshelf Project is Fuul stack a web-based application designed to help users manage their personal book collections and track their reading progress. Built using the MERN stack (MongoDB, Express.js, React, and Node.js),it provides a seamless and interactive experience for book enthusiasts to organize and monitor their reading activities.

✨ Features
🔒 User Authentication: Secure login and registration with JWT.

📚 Bookshelf Management: Add books directly from the Google Books API.

📊 Interactive Dashboard: Track books you’re reading, completed, and want to read.

🗨 Social Features: Rate and review books.

🔍 Search Functionality: Find books by title or author.

📱 Responsive Design: Fully mobile-friendly UI with Tailwind CSS.

💻 Technologies Used
🖥 Frontend ----
Framework: React (Vite)

Styling: Tailwind CSS

State Management: React Context API

🌐 Backend ----
Framework: Express.js

Database: MongoDB with Mongoose

Authentication: JSON Web Tokens (JWT)

API Integration: Google Books API

⚙ Setup Instructions
1️⃣ Clone the repository:

Install dependencies:
git clone [https://github.com/Falcon-Dev07/Bookshelf-System.git]
2️⃣ Setup the Frontend:

Navigate to the frontend folder:
cd Frontend
Install dependencies:
npm install

Set up your .env file:
REACT_APP_GOOGLE_API_KEY=YOUR_KEY
REACT_APP_BASE_URL=http://localhost:5000

Start the development server:
npm run dev
3️⃣ Setup the Backend:

Navigate to the backend folder:
cd Backend
Install dependencies:
npm install

Set up your .env file:

MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
SESSION_SECRET=your_session_secret
GOOGLE_CLIENT_ID=your_CLIENT_GOOGLE_ID
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY

Start the backend server:
npm run dev
4️⃣ Open the App:

Visit the app at http://localhost:5000 🎉 .

📂 Project Structure
🖥 Frontend
frontend/
├── src/
│ ├── components/
│ ├── utils/
│ ├── services/
│ ├── assets/
├── .env

🌐 Backend
backend/
├── config/
├── controllers/
├── middleware/
├── models/
├── routes/
├── .env
├── server.js







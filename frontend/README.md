### **Overview of BookShelf System**

The Bookshelf Project is Full stack a web-based application designed to help users manage their personal book collections and track their reading progress. Built using the MERN stack (MongoDB, Express.js, React, and Node.js), it provides a seamless and interactive experience for book enthusiasts to organize and monitor their reading activities.

---

#### ✨ Features

🔒 **User Authentication:** Secure login and registration with JWT.

📚 **Bookshelf Management:** Add books directly from the Google Books API.

📊 **Interactive Dashboard:** Track books you’re reading, completed, and want to read.

🗨 **Social Features:** Rate and review books.

🔍**Search Functionality:** Find books by title or author.

📱 **Responsive Design:** Fully mobile-friendly UI with Tailwind CSS.

---

#### 💻 Technologies Used

**Frontend**
⚛️ React.js: JavaScript library for building user interfaces.

📈 Redux: State management library for React.

🛣️ React Router: Declarative routing for React applications.

🌐 Axios: Promise-based HTTP client for the browser and Node.js.

🎨 CSS Modules: Scoped CSS for modular and reusable styling.

🖌️ Material-UI: React components for faster and easier web development.

🗂️ Context API: For state management across the application.

**Backend**

🟢 Node.js: JavaScript runtime for server-side development.

🚀 Express: Web framework for building RESTful APIs.

📂 MongoDB: NoSQL database for storing user data, expenses, to-dos, and notes.

🔗 Mongoose: ODM (Object Data Modeling) library for MongoDB and Node.js.

🔑 JWT (JSON Web Tokens): For secure user authentication.

🛡️ Bcrypt.js: For password hashing.

🏷️ Google Books API: API Integration.

---

#### 🚀 Deployment

- **💻 Frontend:** Deployed on Render.
- **🌐 Backend:** Deployed on Render.
- **💾 Database:** Hosted on MongoDB Atlas.

---

#### 🚧 Getting Started

#### Prerequisites

**Frontend:**

- ⚙️ Node.js (v14 or higher)
- 📦 npm or yarn
- ⚛️ react and vite

**Backend:**

- 🟢 Node.js (v14 or higher)
- 📂 MongoDB (Atlas or local)
- 🛠️ Postman or any API client for testing

#### 🛠 Installation

##### 1. Clone the Repository

```bash
git clone [https://github.com/Falcon-Dev07/Bookshelf-System.git]
cd Bookshelf-system
```

##### 2. Setting up the Backend

1. Navigate to the backend directory:

   ```bash
   cd backend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory of the backend and add the following environment variables:

   ```plaintext
   MONGO_URI=your_mongo_db_connection_string
   JWT_SECRET=your_jwt_secret
   PORT=5000
   SESSION_SECRET=your_session_secret
   GOOGLE_CLIENT_ID=your_CLIENT_GOOGLE_ID
   GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
   GOOGLE_API_KEY=YOUR_GOOGLE_API_KEY
   ```

4. Start the backend server:

   ```bash
   npm run dev
   ```

   The server will run on `http://localhost:5000`

##### 3. Setting up the Frontend

1. Navigate to the frontend directory:

   ```bash
   cd frontend
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory of the frontend and add the following environment variables:

   ```plaintext
   REACT_APP_GOOGLE_API_KEY=YOUR_GOOGLE_API
   REACT_APP_BASE_URL=http://localhost:5000
   ```

4. Start the frontend development server:

   ```bash
   npm run dev
   ```

   The frontend will run on `http://localhost:3000`

---

### Project Structure

```plaintext
Bookshelf-System/
├── backend/           # Backend Node.js and Express API
│   ├── models/        # Mongoose models
│   ├── routes/        # Express routes
│   ├── controllers/   # Request handlers
│   ├── middleware/    # Middleware functions
│   ├── config/        # Configuration files
│   └── ...
├── frontend/          # Frontend React application
│   ├── src/
│   │   ├── components/  # Reusable components
│   │   ├── assets/      # images
│   │   ├── utils/       # Context API for state management
│   │   ├── services/    # Axios services for API calls
│   │   └── ...
│   └── ...
└── README.md          # Project README file
```

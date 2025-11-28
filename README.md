An AI-powered study assistant designed to help students learn more efficiently.
This full-stack project includes:

Frontend: React + Vite

Backend: Node.js + Express

Database: MongoDB

Styling: Tailwind CSS

AI Integration: Gemini API (or OpenAI depending on your setup)

This documentation explains everything required to download, install, and run the project successfully.

✅ 1. Project Structure
AI-Study-Assistant/
│
├── backend/                 # Node.js + Express backend
│   ├── controllers/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/                # React (Vite) frontend
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── .gitignore
├── README.md
└── .env.example

🔧 2. Requirements (Must Be Installed)

Must install:

✔ Node.js (LTS version recommended)

https://nodejs.org/

✔ npm (comes with Node)

Check with:

node -v
npm -v

✔ MongoDB

If backend uses MongoDB:
https://www.mongodb.com/try/download/community

📥 3. How to Download the Project

Anyone can download your project by running:

git clone https://github.com/Akashyadav75230/AI-Study-Assistant.git
cd AI-Study-Assistant


Or by clicking Code → Download ZIP on GitHub.

⚙️ 4. Backend Setup (Node.js + Express)
📌 Go to backend folder
cd backend

📌 Create .env file

Copy the example file:

cp ../.env.example .env

📌 Install backend dependencies
npm install

📌 Start backend server
npm run dev


Backend will run at:

👉 http://localhost:5000

💻 5. Frontend Setup (React + Vite)
📌 Open new terminal → go to frontend
cd frontend

📌 Create .env for frontend
cp ../.env.example .env


Make sure this line exists:

VITE_API_BASE_URL=http://localhost:5000/api

📌 Install React/Vite dependencies
npm install

📌 Start frontend
npm run dev


Frontend runs at:

👉 http://localhost:5173

🔑 6. Environment Variables

Here is the .env.example file included in your repo:

# FRONTEND
VITE_API_BASE_URL=http://localhost:5000/api

# BACKEND
PORT=5000
DATABASE_URL=mongodb://localhost:27017/ai-study-assistant
JWT_SECRET=REPLACE_WITH_RANDOM_SECRET
EMAIL_USER=YOUR_EMAIL
EMAIL_PASS=YOUR_EMAIL_PASSWORD


Users copy it like this:

cp .env.example .env


And then fill real values.

🚀 7. How to Run the Full Project
Step 1 — Start backend:
cd backend
npm run dev

Step 2 — Start frontend in a new terminal:
cd frontend
npm run dev

Step 3 — Open browser:

👉 http://localhost:5173

Project will now fully work.

📸 8. Screenshots (Optional)

Add images in:

frontend/public/screenshots/


Then insert:

![Home](public/screenshots/home.png)

🧪 9. Features

User Login & Signup

AI-powered question answering

Flashcards

Quizzes

File handling

Schedule planner

Tailwind UI

Responsive design

🛠️ 10. Troubleshooting
❗ Backend not starting?

MongoDB not running

Wrong .env values

Missing packages → run npm install

❗ Frontend cannot connect to backend?

Check .env:

VITE_API_BASE_URL=http://localhost:5000/api

❗ Getting CORS error?

Add frontend URL in backend CORS settings.

❗ After cloning project not running?

Run:

cd backend && npm install
cd ../frontend && npm install

🤝 11. Contributing

Pull requests and suggestions are welcome.

📜 12. License

MIT License — free to use, modify, and distribute.

👨‍🏫 13. Quick guide to run

To run your project:

Install Node.js

Install MongoDB

Extract or clone the project

Open two terminals:

Terminal 1:

cd backend
npm install
npm run dev


Terminal 2:

cd frontend
npm install
npm run dev


Open browser at:
👉 http://localhost:5173

Everything will work automatically.

🎉 14. Credits

Created by Akash Yadav

Built using:

React

Vite

Node.js

Express

MongoDB

Tailwind CSS

Gemini API

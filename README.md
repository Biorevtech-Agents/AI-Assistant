AI Assistant
Overview
This project is an AI-powered voice assistant integrated with screen capture capabilities. The backend uses Node.js and TypeScript with OpenAI's API for AI responses, while the frontend is built with React, supporting voice input, markdown rendering, and dynamic conversational UI.

Features
Voice input using Web Speech API

AI-powered text responses with markdown formatting

Screen capture integration for context-aware assistance

Text-to-speech with multi-language support (Hindi & English)

Responsive and accessible user interface

Getting Started
Prerequisites
Node.js (v16 or higher recommended)

npm or yarn

OpenAI API key (sign up at OpenAI)

Backend Setup
Navigate to the backend directory:


cd backend
Create a .env file in the backend folder and add your OpenAI API key:

env

OPENAI_API_KEY=your_openai_api_key_here
Install dependencies:


npm install
Build the project:


npm run build
Start the backend server:


npm start
By default, the backend server runs on port 5000.

Frontend Setup
Navigate to the frontend directory:


cd frontend
Create a .env file in the frontend folder and add the backend URL:

env

REACT_APP_BACKEND_URL=http://localhost:5000
Install dependencies:


npm install
Start the frontend development server:


npm start
To build the frontend for production deployment:


npm run build
Environment Variables Summary
File	Variable Name	Description
backend/.env	OPENAI_API_KEY	Your OpenAI API secret key
frontend/.env	REACT_APP_BACKEND_URL	URL of your backend server (local or deployed)

Important Notes
Never commit .env files or secrets to your git repository.

Keep your API keys secure and regenerate immediately if compromised.

Make sure backend and frontend URLs are properly configured in their respective .env files.

For local development, the backend URL is usually http://localhost:5000.

The frontend communicates with the backend using the REACT_APP_BACKEND_URL environment variable.

Folder Structure

root/
│
├── backend/          # Backend Node.js & TypeScript API
│   ├── src/          # Source TypeScript files
│   ├── dist/         # Compiled JavaScript files
│   ├── .env          # Environment variables (not committed)
│   └── package.json
│
├── frontend/         # React frontend
│   ├── src/          # React source files
│   ├── public/       # Static assets
│   ├── .env          # Frontend environment variables (not committed)
│   └── package.json
│
├── .gitignore        # Git ignore file to exclude sensitive files
└── README.md         # This documentation
License
[Add your license here]
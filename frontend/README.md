Synapse Chat AI Assistant
A voice-enabled AI assistant React app with natural language text and speech interaction — supports English, Hindi, and Hinglish input and output with Indian-accented voices.

Features
Voice input with start/stop microphone toggle

Text input box for manual queries

AI chatbot powered by OpenAI API (GPT-4o-mini model)

Speech synthesis with dynamic voice selection for Hindi and English (Indian accent)

Responsive chat UI with user/bot avatars and markdown support

Stop button to cancel ongoing speech or API response

Scrollable chat window with auto-scroll on new messages

Lightweight, no external CSS frameworks, all inline styles

Demo
(Replace with your own screenshot)

Prerequisites
Node.js (v18+ recommended)

npm or yarn package manager

OpenAI API key (set in backend .env)

Project Structure
pgsql
Copy
screen-agent/
├── backend/
│   ├── src/
│   │   └── index.ts           # Express backend API server
│   ├── package.json
│   ├── tsconfig.json
│   └── .env                  # Store OPENAI_API_KEY here
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── VoiceInput.tsx
│   │   └── App.tsx
│   ├── package.json
│   └── tsconfig.json
└── README.md                 # This file
Setup Instructions
Backend
Navigate to the backend folder:

bash
Copy
cd screen-agent/backend
Install dependencies:

bash
Copy
npm install
Create a .env file in backend/ with your OpenAI API key:

ini
Copy
OPENAI_API_KEY=your_openai_api_key_here
Start the backend server:

bash
Copy
npm run dev
The backend will run at http://localhost:5000.

Frontend
Open a new terminal and navigate to the frontend folder:

bash
Copy
cd screen-agent/frontend
Install dependencies:

bash
Copy
npm install
Start the React app:

bash
Copy
npm start
The frontend will open at http://localhost:3000 in your browser.

Usage
Click the microphone button to start voice input, speak your question, and the mic will auto-stop after you finish.

Your spoken query will appear in the text box for manual editing if needed.

Click the send button or press Enter to submit your question.

The AI will reply both in text and voice using an Indian accent (Hindi or English depending on your input).

Use the Stop button to cancel ongoing speech or API response.

Scroll through your chat history seamlessly.

Notes
Voice synthesis depends on the available voices on your browser and OS. Chrome usually supports a good set of Indian English and Hindi voices.

For more natural voice quality, consider integrating third-party TTS APIs.

The app currently uses OpenAI's GPT-4o-mini model for chatbot responses.

Troubleshooting
If speech recognition is not supported, the mic button will alert you.

If no suitable voice is found, the browser default voice will be used.

Make sure your OpenAI API key is valid and set correctly in backend .env.

License
MIT License

Acknowledgments
OpenAI API

React & React Markdown

Browser Web Speech API (SpeechRecognition & SpeechSynthesis)


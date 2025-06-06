import React, { useState, useEffect, useRef } from 'react';
import VoiceInput from './components/VoiceInput';
import ReactMarkdown from 'react-markdown';
import ChatSidebar from './components/ChatSidebar';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Message[];
}

const userImg = 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png';
const botImg = 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png';

const welcomeText = "Hey, I am your AI assistant, how may I help you?";

const markdownStyles: React.CSSProperties = {
  fontFamily: "'Inter', 'Segoe UI', sans-serif",
  color: '#1e293b',
  lineHeight: 1.6,
  fontSize: 15,
  wordBreak: 'break-word',
};

const headingStyle = {
  fontWeight: 700,
  marginTop: 2,
  marginBottom: 2,
  color: '#0f172a',
};

const paragraphStyle = {
  margin: '2px 0 6px 0',
  color: '#334155',
};

const listStyle = {
  paddingLeft: 16,
  margin: '2px 0 6px 0',
};

const listItemStyle = {
  marginBottom: 2,
};

const strongStyle = {
  fontWeight: 700,
  color: '#0f172a',
};

const codeStyle = {
  backgroundColor: '#f1f5f9',
  color: '#2563eb',
  padding: '0.15em 0.3em',
  borderRadius: 6,
  fontFamily: "'JetBrains Mono', 'Courier New', monospace",
  fontSize: '0.95em',
};

const blockquoteStyle = {
  borderLeft: '4px solid #e2e8f0',
  paddingLeft: '1rem',
  color: '#64748b',
  fontStyle: 'italic',
  margin: '6px 0',
};

const linkStyle = {
  color: '#2563eb',
  textDecoration: 'none',
  fontWeight: 500,
};

// Helper to detect if text contains Hindi (Devanagari) chars
function isHindi(text: string) {
  return /[\u0900-\u097F]/.test(text);
}

const MessageComponent = React.memo(({ message }: { message: Message }) => {
  const { id, sender, text } = message;
  return (
    <motion.div
      key={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      style={{
        display: 'flex',
        justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
        gap: '12px',
        alignItems: 'flex-start',
      }}
    >
      {sender === 'bot' && (
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          src={botImg}
          alt="bot"
          style={{ 
            width: 36, 
            height: 36, 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '2px solid #ffffff',
          }}
        />
      )}
      <motion.div
        whileHover={{ scale: 1.01 }}
        style={{
          backgroundColor: sender === 'user' ? '#2563eb' : '#f8fafc',
          color: sender === 'user' ? '#fff' : '#1e293b',
          padding: '10px 10px',
          borderRadius: '16px',
          maxWidth: '75%',
          boxShadow: sender === 'user' 
            ? '0 4px 12px rgba(37, 99, 235, 0.15)' 
            : '0 2px 8px rgba(0,0,0,0.05)',
          whiteSpace: 'pre-wrap',
          fontSize: 15,
          lineHeight: 1.6,
          position: 'relative',
          border: sender === 'user' ? 'none' : '1px solid rgba(0, 0, 0, 0.05)',
        }}
      >
        {sender === 'bot' ? (
          <div style={markdownStyles}>
            <ReactMarkdown
              components={{
                h1: ({ children, ...props }) => (
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h1 style={{...headingStyle, fontSize: '1.8rem'}} {...props}>
                        {children}
                      </h1>
                    </motion.div>
                  </div>
                ),
                h2: ({ children, ...props }) => (
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h2 style={{...headingStyle, fontSize: '1.5rem'}} {...props}>
                        {children}
                      </h2>
                    </motion.div>
                  </div>
                ),
                h3: ({ children, ...props }) => (
                  <div>
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h3 style={{...headingStyle, fontSize: '1.3rem'}} {...props}>
                        {children}
                      </h3>
                    </motion.div>
                  </div>
                ),
                p: ({ children, ...props }) => (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p style={paragraphStyle} {...props}>
                        {children}
                      </p>
                    </motion.div>
                  </div>
                ),
                ul: ({ children, ...props }) => (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ul style={listStyle} {...props}>
                        {children}
                      </ul>
                    </motion.div>
                  </div>
                ),
                ol: ({ children, ...props }) => (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ol style={listStyle} {...props}>
                        {children}
                      </ol>
                    </motion.div>
                  </div>
                ),
                li: ({ children, ...props }) => (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <li style={listItemStyle} {...props}>
                        {children}
                      </li>
                    </motion.div>
                  </div>
                ),
                strong: ({ children, ...props }) => (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <strong style={strongStyle} {...props}>
                        {children}
                      </strong>
                    </motion.div>
                  </div>
                ),
                code: ({ children, ...props }) => (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <code style={codeStyle} {...props}>
                        {children}
                      </code>
                    </motion.div>
                  </div>
                ),
                blockquote: ({ children, ...props }) => (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <blockquote style={blockquoteStyle} {...props}>
                        {children}
                      </blockquote>
                    </motion.div>
                  </div>
                ),
                a: ({ children, ...props }) => (
                  <div>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <a
                        style={linkStyle}
                        {...props}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {children}
                      </a>
                    </motion.div>
                  </div>
                ),
              }}
            >
              {text}
            </ReactMarkdown>
          </div>
        ) : (
          text
        )}
      </motion.div>
      {sender === 'user' && (
        <motion.img
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3 }}
          src={userImg}
          alt="user"
          style={{ 
            width: 36, 
            height: 36, 
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: '2px solid #ffffff',
          }}
        />
      )}
    </motion.div>
  );
});

const App: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>(() => {
    const savedChats = localStorage.getItem('chats');
    return savedChats ? JSON.parse(savedChats) : [{
      id: uuidv4(),
      title: 'New Chat',
      timestamp: new Date(),
      messages: [{ id: 1, sender: 'bot', text: welcomeText }]
    }];
  });
  
  const [activeChat, setActiveChat] = useState<string>(chats[0].id);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [sentFromVoice, setSentFromVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const welcomeSpokenRef = useRef(false);
  const apiBaseUrl = process.env.REACT_APP_BACKEND_URL || 'http://localhost:5000';
  const [hoveredMessage, setHoveredMessage] = useState<number | null>(null);
  const [inputFocused, setInputFocused] = useState(false);
  const [sendButtonHovered, setSendButtonHovered] = useState(false);
  const [stopButtonHovered, setStopButtonHovered] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  const getCurrentChat = () => {
    return chats.find(chat => chat.id === activeChat) || chats[0];
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chats, activeChat, loading]);

  useEffect(() => {
    const synth = window.speechSynthesis;

    function loadVoices() {
      const availableVoices = synth.getVoices();
      setVoices(availableVoices);
    }

    if (synth.onvoiceschanged !== undefined) {
      synth.onvoiceschanged = loadVoices;
    }

    loadVoices();
  }, []);

  // Speak helper using voices and language detection
  function speak(text: string) {
    if (!('speechSynthesis' in window)) return null;

    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);

    const wantHindi = isHindi(text);
    const langCode = wantHindi ? 'hi-IN' : 'en-IN';

    utterance.lang = langCode;

    const selectedVoice =
      voices.find((voice) => {
        const langMatch = voice.lang.toLowerCase().startsWith(langCode.toLowerCase());
        const isHindiVoice = voice.name.toLowerCase().includes('hindi');
        if (wantHindi) {
          return langMatch || isHindiVoice;
        } else {
          return langMatch && !isHindiVoice;
        }
      }) ?? null;

    if (selectedVoice) {
      utterance.voice = selectedVoice;
    }

    utterance.rate = 0.9;
    utterance.pitch = 1.0;

    synth.speak(utterance);

    return utterance;
  }

  useEffect(() => {
    if (!welcomeSpokenRef.current && voices.length > 0) {
      speak(welcomeText);
      welcomeSpokenRef.current = true;
    }
  }, [voices, speak]);

  // Save chats to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('chats', JSON.stringify(chats));
  }, [chats]);

  const addMessage = (sender: 'user' | 'bot', text: string) => {
    setChats(prevChats => {
      return prevChats.map(chat => {
        if (chat.id === activeChat) {
          const newMessage = { id: chat.messages.length + 1, sender, text };
          // Update chat title if it's the first user message
          const updatedMessages = [...chat.messages, newMessage];
          const title = chat.title === 'New Chat' && sender === 'user' 
            ? text.slice(0, 30) + (text.length > 30 ? '...' : '')
            : chat.title;
          return { ...chat, messages: updatedMessages, title };
        }
        return chat;
      });
    });
  };

  const handleNewChat = () => {
    const newChat: Chat = {
      id: uuidv4(),
      title: 'New Chat',
      timestamp: new Date(),
      messages: [{ id: 1, sender: 'bot', text: welcomeText }]
    };
    setChats(prev => [...prev, newChat]);
    setActiveChat(newChat.id);
    setInput('');
  };

  const handleDeleteChat = (chatId: string) => {
    setChats(prev => {
      const updatedChats = prev.filter(chat => chat.id !== chatId);
      if (updatedChats.length === 0) {
        // If all chats are deleted, create a new one
        const newChat: Chat = {
          id: uuidv4(),
          title: 'New Chat',
          timestamp: new Date(),
          messages: [{ id: 1, sender: 'bot', text: welcomeText }]
        };
        return [newChat];
      }
      return updatedChats;
    });
    setActiveChat(prevActiveChat => {
      if (prevActiveChat === chatId) {
        // If the deleted chat was active, set the first remaining chat as active
        const firstRemainingChat = chats.find(chat => chat.id !== chatId);
        return firstRemainingChat?.id || chats[0]?.id;
      }
      return prevActiveChat;
    });
  };

  const stopResponse = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
    setIsTyping(false);
    setIsSpeaking(false);
  };

  const sendQuestion = async (question: string) => {
    if (!question.trim()) return;
    stopResponse();

    addMessage('user', question);
    setIsTyping(true);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch(`${apiBaseUrl}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Fetch error');

      const data = await res.json();
      setIsTyping(false);
      setIsSpeaking(true);
      addMessage('bot', data.answer);

      if ('speechSynthesis' in window) {
        const utterance = speak(data.answer);
        if (utterance) {
          utterance.onend = () => {
            setLoading(false);
            setIsSpeaking(false);
            abortControllerRef.current = null;
          };
        } else {
          setLoading(false);
          setIsSpeaking(false);
          abortControllerRef.current = null;
        }
      } else {
        setLoading(false);
        setIsSpeaking(false);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        addMessage('bot', 'Response stopped.');
      } else {
        addMessage('bot', 'Error contacting backend');
      }
      setLoading(false);
      setIsTyping(false);
      setIsSpeaking(false);
      abortControllerRef.current = null;
    }
  };

  const handleVoiceResult = (text: string) => {
    setInput(text);
    setSentFromVoice(true);
    setIsListening(false);
  };

  const handleListeningChange = (listening: boolean) => {
    setIsListening(listening);
    if (!listening && input.trim() && sentFromVoice) {
      sendQuestion(input.trim());
      setInput('');
      setSentFromVoice(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    sendQuestion(input);
    setInput('');
    setSentFromVoice(false);
  };

  return (
    <div
      style={{
        height: '100vh',
        display: 'flex',
        fontFamily: "'Inter', 'Segoe UI', sans-serif",
        backgroundColor: '#f8fafc',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <ChatSidebar
        chats={chats}
        activeChat={activeChat}
        onNewChat={handleNewChat}
        onSelectChat={setActiveChat}
        onDeleteChat={handleDeleteChat}
      />
      
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          padding: '32px',
          height: '100vh',
          maxWidth: '1200px',
          margin: '12px auto',
          position: 'relative',
          gap: '24px',
        }}
      >
        <div
          style={{
            flexGrow: 1,
            overflowY: 'auto',
            borderRadius: '24px',
            padding: '32px',
            paddingTop: '48px',
            backgroundColor: '#ffffff',
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.03)',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            gap: '24px',
            border: '1px solid rgba(0, 0, 0, 0.05)',
          }}
        >
          <AnimatePresence>
            {getCurrentChat().messages.map((message) => (
              <MessageComponent key={message.id} message={message} />
            ))}
          </AnimatePresence>
          
          {isTyping && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: '#2c2d30',
                borderRadius: '14px',
                marginBottom: '16px',
                color: '#8e8ea0',
                fontSize: '14px',
                fontStyle: 'italic',
                alignSelf: 'flex-start',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #3c3d40',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#4caf50',
                  borderRadius: '50%',
                }}
              />
              AI is thinking...
            </motion.div>
          )}

          {isSpeaking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 16px',
                backgroundColor: '#2c2d30',
                borderRadius: '14px',
                marginBottom: '16px',
                color: '#8e8ea0',
                fontSize: '14px',
                fontStyle: 'italic',
                alignSelf: 'flex-start',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                border: '1px solid #3c3d40',
              }}
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                style={{
                  width: '8px',
                  height: '8px',
                  backgroundColor: '#4caf50',
                  borderRadius: '50%',
                }}
              />
              AI is speaking...
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <motion.form 
          onSubmit={handleSubmit} 
          style={{ 
            display: 'flex', 
            gap: '16px',
            padding: '0 8px',
          }}
        >
          <motion.div
            whileFocus={{ scale: 1.01 }}
            style={{
              flexGrow: 1,
              display: 'flex',
              alignItems: 'center',
              border: `1px solid ${inputFocused ? '#2563eb' : '#e2e8f0'}`,
              borderRadius: '16px',
              padding: '8px 16px',
              backgroundColor: 'white',
              boxShadow: inputFocused 
                ? '0 4px 12px rgba(37, 99, 235, 0.1)' 
                : '0 2px 8px rgba(0,0,0,0.05)',
              transition: 'all 0.3s ease',
            }}
          >
            <input
              type="text"
              placeholder="Type your question..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
              }}
              onFocus={() => setInputFocused(true)}
              onBlur={() => setInputFocused(false)}
              style={{
                flexGrow: 1,
                border: 'none',
                outline: 'none',
                fontSize: 15,
                padding: '8px',
                borderRadius: '12px',
                backgroundColor: 'transparent',
                color: '#1e293b',
              }}
              disabled={loading}
            />
            <VoiceInput onResult={handleVoiceResult} listening={isListening} onListeningChange={handleListeningChange} />
          </motion.div>

          <motion.button
            type="submit"
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            style={{
              padding: '12px 28px',
              fontSize: '15px',
              fontWeight: '500',
              borderRadius: '16px',
              border: 'none',
              backgroundColor: loading ? '#93c5fd' : sendButtonHovered ? '#1d4ed8' : '#2563eb',
              color: '#fff',
              cursor: loading ? 'not-allowed' : 'pointer',
              boxShadow: sendButtonHovered 
                ? '0 4px 12px rgba(37, 99, 235, 0.2)' 
                : '0 2px 8px rgba(37, 99, 235, 0.1)',
              transition: 'all 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
            onMouseEnter={() => setSendButtonHovered(true)}
            onMouseLeave={() => setSendButtonHovered(false)}
          >
            Send
          </motion.button>
        </motion.form>

        <AnimatePresence>
          {loading && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={stopResponse}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              style={{
                backgroundColor: stopButtonHovered ? '#dc2626' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '12px 28px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer',
                height: 48,
                alignSelf: 'center',
                marginTop: 8,
                maxWidth: 600,
                marginLeft: 'auto',
                marginRight: 'auto',
                boxShadow: stopButtonHovered 
                  ? '0 4px 12px rgba(239, 68, 68, 0.2)' 
                  : '0 2px 8px rgba(239, 68, 68, 0.1)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
              onMouseEnter={() => setStopButtonHovered(true)}
              onMouseLeave={() => setStopButtonHovered(false)}
            >
              Stop
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default App;

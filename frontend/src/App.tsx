import React, { useState, useEffect, useRef } from 'react';
import VoiceInput from './components/VoiceInput';
import ReactMarkdown from 'react-markdown';

interface Message {
  id: number;
  sender: 'user' | 'bot';
  text: string;
}

const userImg = 'https://cdn-icons-png.flaticon.com/512/1946/1946429.png';
const botImg = 'https://cdn-icons-png.flaticon.com/512/4712/4712027.png';

const welcomeText = "Hey, I am your AI assistant, how may I help you?";

const markdownStyles: React.CSSProperties = {
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  color: '#222',
  lineHeight: 1.4,
  fontSize: 16,
  wordBreak: 'break-word',
};

const headingStyle = {
  fontWeight: 700,
  marginTop: 2,
  marginBottom: 2,
  color: '#333',
};

const paragraphStyle = {
  margin: '2px 0 6px 0',
  color: '#444',
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
  color: '#000',
};

const codeStyle = {
  backgroundColor: '#eaeaea',
  color: '#d6336c',
  padding: '0.15em 0.3em',
  borderRadius: 4,
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: '0.95em',
};

const blockquoteStyle = {
  borderLeft: '4px solid #ccc',
  paddingLeft: '1rem',
  color: '#666',
  fontStyle: 'italic',
  margin: '6px 0',
};

const linkStyle = {
  color: '#1a73e8',
  textDecoration: 'none',
};

// Helper to detect if text contains Hindi (Devanagari) chars
function isHindi(text: string) {
  return /[\u0900-\u097F]/.test(text);
}

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, sender: 'bot', text: welcomeText },
  ]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [sentFromVoice, setSentFromVoice] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const welcomeSpokenRef = useRef(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

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
  }, [voices]);

  const addMessage = (sender: 'user' | 'bot', text: string) => {
    setMessages((msgs) => [...msgs, { id: msgs.length + 1, sender, text }]);
  };

  const stopResponse = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setLoading(false);
  };

  const sendQuestion = async (question: string) => {
    if (!question.trim()) return;
    stopResponse();

    addMessage('user', question);
    setLoading(true);

    const controller = new AbortController();
    abortControllerRef.current = controller;

    try {
      const res = await fetch('http://localhost:5000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question }),
        signal: controller.signal,
      });

      if (!res.ok) throw new Error('Fetch error');

      const data = await res.json();

      addMessage('bot', data.answer);

      if ('speechSynthesis' in window) {
        const utterance = speak(data.answer);
        if (utterance) {
          utterance.onend = () => {
            setLoading(false);
            abortControllerRef.current = null;
          };
        } else {
          setLoading(false);
          abortControllerRef.current = null;
        }
      } else {
        setLoading(false);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        addMessage('bot', 'Response stopped.');
      } else {
        addMessage('bot', 'Error contacting backend');
      }
      setLoading(false);
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
        maxWidth: 600,
        margin: 'auto',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: 20,
        height: '90vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <h2 style={{ textAlign: 'center', marginBottom: 10 }}>Biorev Chat</h2>

      <div
        style={{
          flexGrow: 1,
          overflowY: 'auto',
          border: '1px solid #ccc',
          borderRadius: 8,
          padding: 10,
          backgroundColor: '#f0f8ff',
          marginBottom: 10,
        }}
      >
        {messages.map(({ id, sender, text }) => (
          <div
            key={id}
            style={{
              display: 'flex',
              justifyContent: sender === 'user' ? 'flex-end' : 'flex-start',
              marginBottom: 15,
            }}
          >
            {sender === 'bot' && (
              <img
                src={botImg}
                alt="bot"
                style={{ width: 32, height: 32, marginRight: 10, borderRadius: '50%' }}
              />
            )}
            <div
              style={{
                backgroundColor: sender === 'user' ? '#4caf50' : '#fff',
                color: sender === 'user' ? '#fff' : '#000',
                padding: '10px 15px',
                borderRadius: 20,
                maxWidth: '75%',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                whiteSpace: 'pre-wrap',
                fontSize: 16,
              }}
            >
              {sender === 'bot' ? (
                <div style={markdownStyles}>
                  <ReactMarkdown
                    components={{
                      h1: ({ node, ...props }) => <h1 style={headingStyle} {...props} />,
                      h2: ({ node, ...props }) => <h2 style={headingStyle} {...props} />,
                      h3: ({ node, ...props }) => <h3 style={headingStyle} {...props} />,
                      p: ({ node, ...props }) => <p style={paragraphStyle} {...props} />,
                      ul: ({ node, ...props }) => <ul style={listStyle} {...props} />,
                      ol: ({ node, ...props }) => <ol style={listStyle} {...props} />,
                      li: ({ node, ...props }) => <li style={listItemStyle} {...props} />,
                      strong: ({ node, ...props }) => <strong style={strongStyle} {...props} />,
                      code: ({ node, ...props }) => <code style={codeStyle} {...props} />,
                      blockquote: ({ node, ...props }) => <blockquote style={blockquoteStyle} {...props} />,
                      a: ({ node, ...props }) => (
                        <a
                          style={linkStyle}
                          {...props}
                          onMouseOver={(e) => {
                            (e.currentTarget.style.textDecoration = 'underline');
                          }}
                          onMouseOut={(e) => {
                            (e.currentTarget.style.textDecoration = 'none');
                          }}
                        />
                      ),
                    }}
                  >
                    {text}
                  </ReactMarkdown>
                </div>
              ) : (
                text
              )}
            </div>
            {sender === 'user' && (
              <img
                src={userImg}
                alt="user"
                style={{ width: 32, height: 32, marginLeft: 10, borderRadius: '50%' }}
              />
            )}
          </div>
        ))}
        {loading && <div style={{ color: '#999' }}>AI is typing...</div>}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} style={{ display: 'flex', marginBottom: 10 }}>
        <div
          style={{
            flexGrow: 1,
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #ccc',
            borderRadius: 20,
            padding: '5px 10px',
            backgroundColor: 'white',
          }}
        >
          <input
            type="text"
            placeholder="Type your question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            style={{
              flexGrow: 1,
              border: 'none',
              outline: 'none',
              fontSize: 16,
              padding: '10px',
              borderRadius: 20,
            }}
            disabled={loading}
          />
          <VoiceInput onResult={handleVoiceResult} listening={isListening} onListeningChange={handleListeningChange} />
        </div>

        <button
          type="submit"
          disabled={loading}
          style={{
            marginLeft: 10,
            padding: '10px 20px',
            fontSize: '16px',
            borderRadius: '20px',
            border: 'none',
            backgroundColor: loading ? '#a5d6a7' : '#4caf50',
            color: '#fff',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
        >
          Send
        </button>
      </form>

      {loading && (
        <button
          onClick={stopResponse}
          style={{
            backgroundColor: '#f44336',
            color: 'white',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 20px',
            cursor: 'pointer',
            height: 40,
            alignSelf: 'center',
            marginTop: 10,
            maxWidth: 600,
            marginLeft: 'auto',
            marginRight: 'auto',
          }}
        >
          Stop
        </button>
      )}
    </div>
  );
};

export default App;

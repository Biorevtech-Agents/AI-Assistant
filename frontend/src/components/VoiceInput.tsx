import React, { useEffect, useRef } from 'react';

interface VoiceInputProps {
  onResult: (text: string) => void;
  listening: boolean;
  onListeningChange: (listening: boolean) => void;
}
// Inline SVG Mic Icons
const MicOnIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20"
    width="20"
    viewBox="0 0 24 24"
    fill="white"
  >
    <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
    <path d="M19 10v1a7 7 0 0 1-14 0v-1" stroke="white" strokeWidth="2" fill="none" />
    <line x1="12" y1="19" x2="12" y2="23" stroke="white" strokeWidth="2" />
    <line x1="8" y1="23" x2="16" y2="23" stroke="white" strokeWidth="2" />
  </svg>
);

const MicOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20"
    width="20"
    viewBox="0 0 24 24"
    fill="white"
  >
    <path d="M19 10v1a7 7 0 0 1-14 0v-1" stroke="white" strokeWidth="2" fill="none" />
    <path d="M12 14a3 3 0 0 0 3-3V5a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3z" />
    <line x1="1" y1="1" x2="23" y2="23" stroke="white" strokeWidth="2" />
  </svg>
);

const VoiceInput: React.FC<VoiceInputProps> = ({ onResult, listening, onListeningChange }) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecognitionActiveRef = useRef<boolean>(false);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[0][0].transcript;
      onResult(transcript);
      isRecognitionActiveRef.current = false;
      onListeningChange(false);
    };

    recognition.onstart = () => {
      isRecognitionActiveRef.current = true;
      onListeningChange(true);
    };

    recognition.onend = () => {
      isRecognitionActiveRef.current = false;
      onListeningChange(false);
    };

    recognition.onerror = (event: ErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      isRecognitionActiveRef.current = false;
      onListeningChange(false);
    };

    recognitionRef.current = recognition;

    // Cleanup function
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, [onResult, onListeningChange]);

  useEffect(() => {
    if (listening && !isRecognitionActiveRef.current) {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
        onListeningChange(false);
      }
    } else if (!listening && isRecognitionActiveRef.current) {
      try {
        recognitionRef.current?.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }, [listening, onListeningChange]);

  const toggleListening = () => {
    if (isRecognitionActiveRef.current) {
      try {
        recognitionRef.current?.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    onListeningChange(!listening);
  };

  return (
    <button
      onClick={toggleListening}
      style={{
        backgroundColor: listening ? '#f44336' : '#4caf50',
        border: 'none',
        borderRadius: 20,
        padding: '8px 14px',
        marginLeft: 8,
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width: 50,
        height: 40,
      }}
      title={listening ? 'Stop Listening' : 'Start Listening'}
      aria-label={listening ? 'Stop Listening' : 'Start Listening'}
    >
      {listening ? <MicOffIcon /> : <MicOnIcon />}
    </button>
  );
};

export default VoiceInput;

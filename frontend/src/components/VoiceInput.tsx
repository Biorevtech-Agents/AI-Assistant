import React, { useEffect, useRef } from 'react';

interface VoiceInputProps {
  onResult: (text: string) => void;
  listening: boolean;
  onListeningChange: (listening: boolean) => void;
  continuousTalk: boolean;
  onContinuousTalkChange: (continuous: boolean) => void;
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

// New Talk Icon
const TalkIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    height="20"
    width="20"
    viewBox="0 0 24 24"
    fill="white"
  >
    <path d="M12 3C7.03 3 3 7.03 3 12s4.03 9 9 9 9-4.03 9-9-4.03-9-9-9zm0 16c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/>
    <path d="M10 8l6 4-6 4V8z"/>
  </svg>
);

const VoiceInput: React.FC<VoiceInputProps> = ({ 
  onResult, 
  listening, 
  onListeningChange,
  continuousTalk,
  onContinuousTalkChange
}) => {
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const isRecognitionActiveRef = useRef<boolean>(false);

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition API not supported');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = continuousTalk;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = event.results[event.results.length - 1][0].transcript;
      onResult(transcript);
      if (!continuousTalk) {
        isRecognitionActiveRef.current = false;
        onListeningChange(false);
      }
    };

    recognition.onstart = () => {
      isRecognitionActiveRef.current = true;
      onListeningChange(true);
    };

    recognition.onend = () => {
      if (continuousTalk && isRecognitionActiveRef.current) {
        try {
          recognition.start();
        } catch (error) {
          console.error('Error restarting recognition:', error);
          isRecognitionActiveRef.current = false;
          onListeningChange(false);
        }
      } else {
        isRecognitionActiveRef.current = false;
        onListeningChange(false);
      }
    };

    recognition.onerror = (event: ErrorEvent) => {
      console.error('Speech recognition error:', event.error);
      isRecognitionActiveRef.current = false;
      onListeningChange(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (error) {
          console.error('Error stopping recognition:', error);
        }
      }
    };
  }, [onResult, onListeningChange, continuousTalk]);

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

  // Add effect to handle continuous talk mode changes
  useEffect(() => {
    if (continuousTalk && !isRecognitionActiveRef.current) {
      try {
        recognitionRef.current?.start();
      } catch (error) {
        console.error('Error starting continuous recognition:', error);
        onContinuousTalkChange(false);
      }
    }
  }, [continuousTalk, onContinuousTalkChange]);

  const toggleListening = () => {
    if (continuousTalk) {
      // If continuous talk is active, don't allow regular mic toggle
      return;
    }
    
    if (isRecognitionActiveRef.current) {
      try {
        recognitionRef.current?.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    onListeningChange(!listening);
  };

  const toggleContinuousTalk = () => {
    if (isRecognitionActiveRef.current) {
      try {
        recognitionRef.current?.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
    onContinuousTalkChange(!continuousTalk);
  };

  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <button
        onClick={toggleContinuousTalk}
        style={{
          backgroundColor: continuousTalk ? '#f44336' : '#2196f3',
          border: 'none',
          borderRadius: 20,
          padding: '8px 14px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 50,
          height: 40,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
        }}
        title={continuousTalk ? 'Stop Continuous Talk' : 'Start Continuous Talk'}
        aria-label={continuousTalk ? 'Stop Continuous Talk' : 'Start Continuous Talk'}
      >
        <TalkIcon />
      </button>
      <button
        onClick={toggleListening}
        style={{
          backgroundColor: listening ? '#f44336' : '#4caf50',
          border: 'none',
          borderRadius: 20,
          padding: '8px 14px',
          cursor: continuousTalk ? 'not-allowed' : 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 50,
          height: 40,
          opacity: continuousTalk ? 0.5 : 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease',
        }}
        title={continuousTalk ? 'Disabled during continuous talk' : (listening ? 'Stop Listening' : 'Start Listening')}
        aria-label={continuousTalk ? 'Disabled during continuous talk' : (listening ? 'Stop Listening' : 'Start Listening')}
        disabled={continuousTalk}
      >
        {listening ? <MicOffIcon /> : <MicOnIcon />}
      </button>
    </div>
  );
};

export default VoiceInput;

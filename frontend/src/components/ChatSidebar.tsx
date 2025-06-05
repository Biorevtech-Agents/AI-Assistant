import React, { useState } from 'react';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import ChatIcon from '@mui/icons-material/Chat';
import DeleteIcon from '@mui/icons-material/Delete';
import { motion, AnimatePresence } from 'framer-motion';

interface Chat {
  id: string;
  title: string;
  timestamp: Date;
  messages: Array<{
    id: number;
    sender: 'user' | 'bot';
    text: string;
  }>;
}

interface ChatSidebarProps {
  chats: Chat[];
  activeChat: string | null;
  onNewChat: () => void;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
}

const ChatSidebar: React.FC<ChatSidebarProps> = ({
  chats,
  activeChat,
  onNewChat,
  onSelectChat,
  onDeleteChat,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [hoveredChat, setHoveredChat] = useState<string | null>(null);

  const filteredChats = chats.filter((chat) =>
    chat.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDeleteClick = (e: React.MouseEvent<HTMLButtonElement>, chatId: string) => {
    e.stopPropagation();
    onDeleteChat(chatId);
  };

  return (
    <motion.div
      initial={{ x: -300, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      style={{
        width: '300px',
        height: '110%',
        backgroundColor: '#1a1b1e',
        color: '#fff',
        display: 'flex',
        flexDirection: 'column',
        borderRight: '1px solid #2c2d30',
        boxShadow: '4px 0 20px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        style={{
          borderBottom: '1px solid #2c2d30',
          background: 'linear-gradient(45deg, #1a1b1e 0%, #2c2d30 100%)',
        }}
      >
        <h1 style={{
          margin: '115px 0 25px 0',
          fontSize: '1.5rem',
          fontWeight: '600',
          color: '#4caf50',
          textAlign: 'center',
          textShadow: '0 2px 4px rgba(0,0,0,0.2)',
          letterSpacing: '0.5px',
        }}>
          Biorev Chat
        </h1>
      </motion.div>

      {/* Content Container */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        padding: '20px',
        gap: '10px',
        overflow: 'hidden',
      }}>
        {/* New Chat Button */}
        <motion.button
          onClick={onNewChat}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '10px 10px',
            backgroundColor: '#2c2d30',
            border: '1px solid #3c3d40',
            borderRadius: '14px',
            color: '#fff',
            width: '100%',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            fontSize: '15px',
            fontWeight: '500',
          }}
        >
          <motion.div
            whileHover={{ rotate: 90 }}
            transition={{ duration: 0.3 }}
            style={{
              backgroundColor: '#4caf50',
              borderRadius: '8px',
              padding: '6px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <AddIcon sx={{ fontSize: 20, color: '#fff' }} />
          </motion.div>
          New Chat
        </motion.button>

        {/* Search Box */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          style={{
            position: 'relative',
           
          }}
        >
          <motion.div
            animate={{ 
              color: searchFocused ? '#4caf50' : '#8e8ea0',
              scale: searchFocused ? 1.1 : 1
            }}
            transition={{ duration: 0.2 }}
            style={{
              position: 'absolute',
              left: '14px',
              top: '30%',
              transform: 'translateY(-50%)',
              display: 'flex',
              alignItems: 'center',
              zIndex: 1,
            }}
          >
            <SearchIcon sx={{ fontSize: 20 }} />
          </motion.div>
          <motion.input
            type="text"
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            whileFocus={{ scale: 1.01 }}
            style={{
              
              padding: '14px 39px 14px 44px',
              backgroundColor: searchFocused ? '#3c3d40' : '#2c2d30',
              border: `1px solid ${searchFocused ? '#4caf50' : '#3c3d40'}`,
              borderRadius: '14px',
              color: '#fff',
              fontSize: '14px',
              transition: 'all 0.2s ease',
              outline: 'none',
              boxShadow: searchFocused ? '0 0 0 2px rgba(76, 175, 80, 0.1)' : 'none',
            }}
          />
        </motion.div>

        {/* Chat List */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          style={{
            overflowY: 'auto',
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            paddingRight: '4px',
          }}
        >
          <AnimatePresence>
            {filteredChats.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                style={{
                  padding: '24px',
                  textAlign: 'center',
                  color: '#8e8ea0',
                  fontSize: '14px',
                  fontStyle: 'italic',
                  backgroundColor: '#2c2d30',
                  borderRadius: '14px',
                  margin: '8px 0',
                }}
              >
                No chats found
              </motion.div>
            ) : (
              filteredChats.map((chat) => (
                <motion.div
                  key={chat.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => onSelectChat(chat.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    padding: '7px',
                    backgroundColor: activeChat === chat.id ? '#2c2d30' : '#1e1f22',
                    borderRadius: '14px',
                    cursor: 'pointer',
                    position: 'relative',
                    transition: 'all 0.2s ease',
                    border: '1px solid',
                    borderColor: activeChat === chat.id ? '#3c3d40' : 'transparent',
                    boxShadow: activeChat === chat.id 
                      ? '0 4px 12px rgba(0, 0, 0, 0.15)' 
                      : '0 2px 8px rgba(0, 0, 0, 0.1)',
                  }}
                  onMouseEnter={() => setHoveredChat(chat.id)}
                  onMouseLeave={() => setHoveredChat(null)}
                >
                  <motion.div
                    animate={{ 
                      rotate: hoveredChat === chat.id ? 360 : 0,
                      color: activeChat === chat.id ? '#4caf50' : '#8e8ea0'
                    }}
                    transition={{ duration: 0.3 }}
                    style={{
                      backgroundColor: activeChat === chat.id ? 'rgba(76, 175, 80, 0.1)' : 'rgba(142, 142, 160, 0.1)',
                      borderRadius: '8px',
                      padding: '6px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <ChatIcon sx={{ fontSize: 20 }} />
                  </motion.div>
                  <motion.span
                    animate={{ 
                      color: activeChat === chat.id ? '#fff' : '#8e8ea0',
                      x: hoveredChat === chat.id ? 5 : 0
                    }}
                    transition={{ duration: 0.2 }}
                    style={{ 
                      flex: 1, 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis', 
                      whiteSpace: 'nowrap',
                      fontSize: '14px',
                      fontWeight: activeChat === chat.id ? '500' : '400',
                    }}
                  >
                    {chat.title}
                  </motion.span>
                  <AnimatePresence>
                    {hoveredChat === chat.id && (
                      <motion.button
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => handleDeleteClick(e, chat.id)}
                        whileHover={{ scale: 1.1, color: '#ff4444' }}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#8e8ea0',
                          cursor: 'pointer',
                          padding: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          transition: 'all 0.2s ease',
                          borderRadius: '8px',
                          backgroundColor: 'rgba(255, 68, 68, 0.1)',
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 18 }} />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ChatSidebar; 
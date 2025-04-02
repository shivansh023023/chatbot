import React, { useState, useRef, useEffect } from 'react';
import { HelpCircle, History, Trash2 } from 'lucide-react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { Message, ChatState } from './types';
import { generateResponse as askCyberGuard } from './services/gemini';

function App() {
  const [chatBox, setChatBox] = useState<ChatState>({
    messages: [{
      id: '1',
      content: "Hey there! 👋 I'm CyberGuard, your cybersecurity buddy! Ready to explore ethical hacking, encryption, or security? 🛡️",
      role: 'assistant',
      timestamp: new Date(),
    }],
    isLoading: false,
  });
  const [pastChats, setPastChats] = useState<{ id: string; title: string }[]>([]);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatBox.messages]);

  const handleNewMessage = async (messageText: string, attachment?: File) => {
    const newMessage: Message = {
      id: Date.now().toString(),
      content: messageText,
      role: 'user',
      timestamp: new Date(),
      ...(attachment && {
        attachment: {
          name: attachment.name,
          url: URL.createObjectURL(attachment),
          type: attachment.type,
        }
      })
    };

    setChatBox(curr => ({ ...curr, messages: [...curr.messages, newMessage], isLoading: true }));

    try {
      const response = await askCyberGuard(messageText);
      setChatBox(curr => ({
        ...curr,
        messages: [...curr.messages, {
          id: (Date.now() + 1).toString(),
          content: response,
          role: 'assistant',
          timestamp: new Date(),
        }],
        isLoading: false,
      }));

      if (pastChats.length === 0) {
        setPastChats([{
          id: Date.now().toString(),
          title: messageText.slice(0, 30) + (messageText.length > 30 ? '...' : '')
        }]);
      }
    } catch (error) {
      setChatBox(curr => ({ ...curr, isLoading: false }));
      alert(error instanceof Error ? error.message : 'Oops! Try again? 😅');
    }
  };

  const startFreshChat = () => {
    setChatBox({
      messages: [{
        id: Date.now().toString(),
        content: "Hey! 👋 CyberGuard ready for more security chat! What's on your mind? 🛡️",
        role: 'assistant',
        timestamp: new Date(),
      }],
      isLoading: false,
    });
    setPastChats([]);
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-64 bg-gray-800 p-4 flex flex-col">
        <div className="flex-1">
          <h2 className="text-lg font-semibold mb-4">Chat History</h2>
          {pastChats.map(chat => (
            <div key={chat.id} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer">
              <History className="w-5 h-5" />
              <span className="truncate">{chat.title}</span>
            </div>
          ))}
        </div>
        <div className="space-y-2">
          {[
            { icon: Trash2, text: 'Start Fresh', onClick: startFreshChat },
            { icon: HelpCircle, text: 'Help', onClick: () => {} }
          ].map(({ icon: Icon, text, onClick }) => (
            <button key={text} onClick={onClick} className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-700 w-full">
              <Icon className="w-5 h-5" />
              <span>{text}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="border-b border-gray-700 p-4">
          <h1 className="text-xl font-semibold">CyberGuard - Your Security Sidekick 🛡️</h1>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chatBox.messages.map(msg => <ChatMessage key={msg.id} message={msg} />)}
          <div ref={chatEndRef} />
        </div>
        <ChatInput onSendMessage={handleNewMessage} isLoading={chatBox.isLoading} />
      </div>
    </div>
  );
}

export default App
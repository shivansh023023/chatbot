import React from 'react';
import { User, Bot, FileText, Music } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Message } from '../types';
import clsx from 'clsx';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={clsx(
      'flex gap-4 p-6',
      isUser ? 'bg-transparent' : 'bg-gray-900'
    )}>
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center">
            <User className="w-5 h-5 text-white" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-purple-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
        )}
      </div>
      <div className="flex-1 prose prose-invert max-w-none">
        <ReactMarkdown>{message.content}</ReactMarkdown>
        {message.attachment && (
          <div className="mt-2 p-2 bg-gray-800 rounded-lg inline-block">
            {message.attachment.type.startsWith('image/') ? (
              <img
                src={message.attachment.url}
                alt={message.attachment.name}
                className="max-w-sm rounded"
              />
            ) : message.attachment.type.startsWith('audio/') ? (
              <div className="flex items-center gap-2">
                <Music className="w-5 h-5" />
                <audio controls src={message.attachment.url} className="h-10" />
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                <a
                  href={message.attachment.url}
                  download={message.attachment.name}
                  className="text-blue-400 hover:text-blue-300"
                >
                  {message.attachment.name}
                </a>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
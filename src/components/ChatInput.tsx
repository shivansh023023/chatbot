import React, { useState, useRef } from 'react';
import { Send, Mic, Paperclip, StopCircle } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (message: string, attachment?: File) => void;
  isLoading: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage, isLoading }) => {
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = () => {
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput('');
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSendMessage(`Attached file: ${file.name}`, file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error('Browser not supported');
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: BlobPart[] = [];

      recorder.ondataavailable = e => chunks.push(e.data);
      recorder.onstop = () => {
        const audioBlob = new Blob(chunks, { type: 'audio/wav' });
        onSendMessage('Voice message', new File([audioBlob], 'voice-message.wav', { type: 'audio/wav' }));
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (error) {
      console.error('Recording error:', error);
      alert('Microphone access needed for voice messages');
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  const stopRecording = () => {
    if (mediaRecorder?.state === 'recording') {
      mediaRecorder.stop();
      setIsRecording(false);
      setMediaRecorder(null);
    }
  };

  return (
    <div className="border-t border-gray-700 bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto flex gap-4">
        <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,audio/*,video/*,.pdf,.doc,.docx,.txt" />
        <button onClick={() => fileInputRef.current?.click()} className="p-3 rounded-full bg-gray-800 text-white hover:bg-gray-700">
          <Paperclip className="w-5 h-5" />
        </button>
        <textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSubmit())}
          placeholder="Ask about cybersecurity..."
          className="flex-1 bg-gray-800 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
          rows={1}
          disabled={isLoading}
        />
        <button onClick={handleSubmit} disabled={!input.trim() || isLoading} className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
          <Send className="w-5 h-5" />
        </button>
        <button onClick={isRecording ? stopRecording : startRecording} className={`p-3 rounded-full ${isRecording ? 'bg-red-600 hover:bg-red-700' : 'bg-gray-800 hover:bg-gray-700'} text-white`}>
          {isRecording ? <StopCircle className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
        </button>
      </div>
    </div>
  );
};
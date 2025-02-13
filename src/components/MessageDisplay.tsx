import React from 'react';

interface MessageDisplayProps {
  message: { text: string; type: 'success' | 'error' } | null;
}

export function MessageDisplay({ message }: MessageDisplayProps) {
  if (!message) return null;

  return (
    <div
      className={`px-4 py-3 rounded-lg text-sm ${
        message.type === 'success' ? 'bg-green-50 text-green-500' : 'bg-red-50 text-red-500'
      }`}
    >
      {message.text}
    </div>
  );
}
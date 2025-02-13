import React from 'react';
import { type User } from '../lib/db';

interface WelcomeViewProps {
  user: User;
  onLogout: () => void;
}

export function WelcomeView({ user, onLogout }: WelcomeViewProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900">Hoş Geldiniz, {user.email}</h1>
          <p className="mt-2 text-gray-600">Başarıyla giriş yaptınız.</p>
        </div>
        <button
          onClick={onLogout}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
        >
          Çıkış Yap
        </button>
      </div>
    </div>
  );
}
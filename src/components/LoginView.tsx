import React, { useState } from 'react';
import { LoginForm } from './LoginForm';
import { RegisterForm } from './RegisterForm';
import { CircleUserRound, UserPlus } from 'lucide-react';
import { loginUser, registerUser, type User } from '../lib/db';
import { MessageDisplay } from './MessageDisplay';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export function LoginView({ onLoginSuccess }: LoginViewProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const handleLogin = async (email: string, password: string, rememberMe: boolean) => {
    const result = await loginUser(email, password);
    
    if (result.success && result.user) {
      onLoginSuccess(result.user);
      setMessage({ text: result.message, type: 'success' });
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  const handleRegister = async (email: string, password: string) => {
    const result = await registerUser(email, password);
    
    if (result.success) {
      setMessage({ text: result.message, type: 'success' });
      setIsRegistering(false);
    } else {
      setMessage({ text: result.message, type: 'error' });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8 space-y-6">
        <MessageDisplay message={message} />
        
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
            {isRegistering ? (
              <UserPlus className="w-8 h-8 text-blue-600" />
            ) : (
              <CircleUserRound className="w-8 h-8 text-blue-600" />
            )}
          </div>
          <h1 className="text-2xl font-bold text-gray-900">
            {isRegistering ? 'Kayıt Ol' : 'Hoş Geldiniz'}
          </h1>
          <p className="mt-2 text-gray-600">
            {isRegistering ? 'Yeni hesap oluşturun' : 'Hesabınıza giriş yapın'}
          </p>
        </div>

        {isRegistering ? (
          <RegisterForm
            onSubmit={handleRegister}
            onCancel={() => setIsRegistering(false)}
          />
        ) : (
          <LoginForm 
            onSubmit={handleLogin}
            onRegisterClick={() => setIsRegistering(true)}
          />
        )}
      </div>
    </div>
  );
}
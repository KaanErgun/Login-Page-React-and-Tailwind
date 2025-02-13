import React, { useState } from 'react';
import { LoginView } from './components/LoginView';
import { WelcomeView } from './components/WelcomeView';
import { type User } from './lib/db';

export default function App() {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  if (currentUser) {
    return <WelcomeView user={currentUser} onLogout={() => setCurrentUser(null)} />;
  }

  return <LoginView onLoginSuccess={setCurrentUser} />;
}
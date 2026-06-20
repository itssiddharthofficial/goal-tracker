import { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp';

export default function AuthPage() {
  const [isLoginMode, setIsLoginMode] = useState(true);

  return (
    <>
      {isLoginMode ? (
        <Login onSwitchToSignUp={() => setIsLoginMode(false)} />
      ) : (
        <SignUp onSwitchToLogin={() => setIsLoginMode(true)} />
      )}
    </>
  );
}

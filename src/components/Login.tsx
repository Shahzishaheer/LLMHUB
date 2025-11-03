import { SignIn } from '@clerk/clerk-react';
import {  type JSX } from 'react';

const Login = (): JSX.Element => {
  
  
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-blue-600 hover:bg-blue-700'
          }
        }}
      />
    </div>
  );
};

export default Login;

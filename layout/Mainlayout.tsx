import { Outlet } from 'react-router-dom';
import Navbar from '../src/components/Navbar.tsx';
import React from 'react';

// Define the type for props
type MainLayoutProps = {
  children?: React.ReactNode; // React.ReactNode means anything React can render
};

const MainLayout = ({ children }: MainLayoutProps) => {
  return (
    <div>
      <Navbar />
      <main className="min-h-screen">
        {/* You can show either passed children or nested route outlet */}
        {children || <Outlet />}
      </main>
    </div>
  );
};

export default MainLayout;


import './App.css';
import { Routes, Route } from 'react-router-dom';
import Mainlayout from '../layout/Mainlayout';
import Home from './pages/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './pages/About';
import UserProfile from './components/UserProfile';
import Imagegenerate from './components/Imagegenerate';


function App() {
  return (
    <Mainlayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/imagegenerate" element={<Imagegenerate />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<UserProfile />} />

      </Routes>
    </Mainlayout>
  );
}

export default App;

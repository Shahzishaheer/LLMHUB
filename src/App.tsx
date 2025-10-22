
import './App.css';
import { Routes, Route } from 'react-router-dom';
import Mainlayout from '../layout/Mainlayout';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App() {
  return (
    <Mainlayout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </Mainlayout>
  );
}

export default App;

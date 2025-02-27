import './App.css';
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import QubicWallet from './pages/QubicWallet/index.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<QubicWallet />} />
      </Routes>
    </Router>
  );
}

export default App;

import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Home from './pages/Home'
import Produtos from './pages/Produtos'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <Sidebar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/visao-geral" element={<Home />} />
          <Route path="/produtos" element={<Produtos />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App

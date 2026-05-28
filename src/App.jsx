import { BrowserRouter, Routes, Route, Link } from 'react-router-dom'
import Produtos from './pages/Produtos'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <nav>
        <Link to="/produtos">
          <button>Produtos</button>
        </Link>
      </nav>

      <Routes>
        <Route path="/produtos" element={<Produtos />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
import { Route, Routes } from 'react-router-dom'
import './App.css'
import { Header } from './components/Header/Header'
import { Home } from './pages/Home/Home'
import { Memorias } from './pages/Memorias/Memorias'
import { Habilidades } from './pages/Habilidades/Habilidades'
import { Traumas } from './pages/Traumas/Traumas'

function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/memorias" element={<Memorias />} />
        <Route path="/habilidades" element={<Habilidades />} />
        <Route path="/traumas" element={<Traumas />} />
      </Routes>
    </>
  )
}

export default App

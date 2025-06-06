import React from 'react'
import Home from './pages/Home'
import Info from './pages/Info'
import About from './pages/About'
import { BrowserRouter as Router ,Routes,Route} from 'react-router-dom'
import DiseaseInfo from './pages/DiseaseInfo'
const App = () => {
  return (
    <Router>
    
    <Routes>
      <Route path="/" element={<Home />} />
      {/* <Route path="/about" element={<About />} /> */}
      <Route path="/diseaseinfo/:prediction" element={<Info/>} /> 
      <Route path="/disease-info" element={<DiseaseInfo/>} />
      <Route path="/about" element={<About/>}/>
    </Routes>
  </Router>
  )
}

export default App

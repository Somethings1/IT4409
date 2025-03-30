

import './App.css';
import {Route, Routes} from 'react-router-dom';

import Main  from './components/introduce/Main_intro.jsx'

function App() {
  return (
    <>

      <Routes>
      <Route path="/" element={<Main />} /> 
      
      </Routes>
    </>
  );
}

export default App;
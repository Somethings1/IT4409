

import './App.css';
import {Route, Routes} from 'react-router-dom';
import LayoutDefault from './layouts/LayoutDefault/index.js';
import Home from './pages/Home/index.js';

import Main  from './components/introduce/Main_intro.js'

import ProtectedRoute from "./components/introduce/protect.js";

import {Loading} from './components/introduce/Loading.js'

import Notification from './components/Notification/notification.js';

function App() {
  return (
    <>
    <Loading />
    <Notification />
      <Routes>
      <Route path="/" element={<Main />} /> 
      <Route path='/home' element={
          <ProtectedRoute><LayoutDefault/></ProtectedRoute>
          }>
          <Route path='/home' element={<Home/>}/>

        </Route>
 
      </Routes>
    </>
  );
}

export default App;
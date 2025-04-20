

import './App.css';
import {Route, Routes} from 'react-router-dom';
import LayoutDefault from './layouts/LayoutDefault/index.jsx';
import Home from './pages/Home/index.jsx';
import ManageProblem from './pages/ManageProblem/index.jsx';
import Main  from './components/introduce/Main_intro.jsx'

import ProtectedRoute from "./components/introduce/protect.jsx";

import {Loading} from './components/introduce/Loading.jsx'

import Notification from './components/Notification/notification.jsx';
import CodeEditor from './components/CodeEditor/CodeEditor.jsx';

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
          <Route path="manage-problem" element={<ManageProblem />} />
          <Route path="code-editor" element={<CodeEditor />} />
        </Route>
 
      </Routes>
    </>
  );
}

export default App;
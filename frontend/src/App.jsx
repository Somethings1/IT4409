

import './App.css';
import {Route, Routes} from 'react-router-dom';
import LayoutDefault from './layouts/LayoutDefault/index.jsx';
import LayoutUser from './layouts/LayoutUser/index.jsx';
import Home from './pages/Home/index.jsx';
import ManageProblem from './pages/ManageProblem/index.jsx';
import UserProblem from './pages/UserProblem/index.jsx';
import Main  from './components/introduce/Main_intro.jsx'
import Profile from './pages/Profile/index.jsx';
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
      
      <Route
          path="/home"
          element={
            <ProtectedRoute role="Admin">
              <LayoutDefault />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home/>}/>
           <Route path='profile' element={<Profile/>}/>
          <Route path="manage-problem" element={<ManageProblem />} />
          <Route path="code-editor" element={<CodeEditor />} />
        </Route>
            {/* User */}
        <Route
          path="/code"
          element={
            <ProtectedRoute role="User">
              <LayoutUser/>
            </ProtectedRoute>
          }
        >
              <Route index element={<Home />} />
              <Route path='profile' element={<Profile/>}/>
              <Route path="manage-problem" element={<UserProblem />} />
              <Route path="code-editor" element={<CodeEditor />} />
          {/* <Route path="try-on" element={<TryOn />} /> */}
          
           {/* <Route path="import" element={<Import />} /> */}
   
        </Route>
      </Routes>
    </>
  );
}

export default App;
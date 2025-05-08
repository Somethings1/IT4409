

import './App.css';
import {Route, Routes} from 'react-router-dom';
import LayoutDefault from './layouts/LayoutDefault/index.jsx';
import LayoutUser from './layouts/LayoutUser/index.jsx';
import Home from './pages/Home/index.jsx';
import HomeUser from './pages/HomeUser/index.jsx';
import ManageProblem from './pages/ManageProblem/index.jsx';
import UserProblem from './pages/UserProblem/index.jsx';
import Main  from './components/introduce/Main_intro.jsx'
import Profile from './pages/Profile/index.jsx';
import ProtectedRoute from "./components/introduce/protect.jsx";

import {Loading} from './components/introduce/Loading.jsx'

import Notification from './components/Notification/notification.jsx';
import SolveProblemPage from './components/SolveProblemPage';

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
            <ProtectedRoute role="ADMIN">
              <LayoutDefault />
            </ProtectedRoute>
          }
        >
          <Route index element={<Home/>}/>
           <Route path='profile' element={<Profile/>}/>
          <Route path="manage-problem" element={<ManageProblem />} />
          <Route path="solve" element={<SolveProblemPage />} />
        </Route>
            {/* User */}
        <Route
          path="/code"
          element={
            <ProtectedRoute role="USER">
              <LayoutUser/>
            </ProtectedRoute>
          }
        >
              <Route index element={<HomeUser />} />
              <Route path='profile' element={<Profile/>}/>
              <Route path="manage-problem" element={<UserProblem />} />
              <Route path="solve" element={<SolveProblemPage />} />
          {/* <Route path="try-on" element={<TryOn />} /> */}

           {/* <Route path="import" element={<Import />} /> */}

        </Route>
      </Routes>
    </>
  );
}

export default App;

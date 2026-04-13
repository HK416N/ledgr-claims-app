import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Authenticator } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import NavBar from './components/NavBar';

import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import ClaimsHistory from './pages/ClaimsHistory';
import ClaimDetails from './pages/ClaimDetails';

// Stubs
const NewClaim = () => <p>New Claim — coming soon</p>;
const EditClaim = () => <p>Edit Claim — coming soon</p>;

const App = () => {
  return (
    <BrowserRouter>
      <Authenticator>

        <ToastContainer position="top-right" autoClose={3000}></ToastContainer>

        <Routes>
          {/* Public */}
          <Route path="/login" element={<Login/>}/>
          <Route path="/signup" element={<Signup/>}/>

          {/* Private */}
          <Route element={<PrivateRoute/>}>
            <Route element={<NavBar/>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/history" element={<ClaimsHistory />} />
              <Route path="/claims/new" element={<NewClaim />} />
              <Route path="/claims/:id" element={<ClaimDetails />} />
              <Route path="/claims/:id/edit" element={<EditClaim />} />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Authenticator>
    </BrowserRouter>
  );
};

export default App;
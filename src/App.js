// App.js
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from './components/common/Navbar';
import LoginPage from './components/auth/LoginPage';
import RegistrationPage from './components/auth/RegistrationPage';
import FooterComponent from './components/common/Footer';
import UserService from './components/service/UserService';
import UpdateUser from './components/userspage/UpdateUser';
import UserManagementPage from './components/userspage/UserManagementPage';
import ProfilePage from './components/userspage/ProfilePage';

import Employeepage from './components/employee/employee';
import Adminpage from './components/admin/admin';
import Posttaskpage from './components/posttask/posttask';
import Register from './components/newregister/register';
import Userrequests from './components/admin/userrequests';

import Posttaskemp from './components/employee/posttaskemp';

function App() {

  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="content">
          <Routes>
            <Route exact path="/" element={<LoginPage />} />
            <Route exact path="/login" element={<LoginPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/employee" element={<Employeepage/>} />
            <Route path="/admin" element={< Adminpage/>} />
            <Route path='/posttask' element={< Posttaskpage/>} />
            <Route path='/newregister' element={< Register/>} />
            <Route path='/userrequests' element={< Userrequests/>} />

            {/* for employee posting the task */}
            <Route path='/Posttaskemp' element={<Posttaskemp/>}/>

            
            {/* Check if user is authenticated and admin before rendering admin-only routes */}
            {UserService.adminOnly() && (
              <>
                <Route path="/register" element={<RegistrationPage />} />
                <Route path="/admin/user-management" element={<UserManagementPage />} />
                <Route path="/update-user/:userId" element={<UpdateUser />} />
              </>
            )}
            <Route path="*" element={<Navigate to="/login" />} />‰
          </Routes>
        </div>
        <FooterComponent />
      </div>
    </BrowserRouter>
  );
}

export default App;

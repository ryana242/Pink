import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import reportWebVitals from './reportWebVitals';
import Navbar from './Components/navbar';
import Footer from './Components/footer';
import Homepage from './Components/homepage';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Register from './Components/register';
import Login from './Components/login';
import ForgetPassword from './Components/forgetPassword';
import ResetPassword from './Components/resetPassword';
import LodgeComplaint from './Components/lodgeComplain';
import Dashboard from './Components/dashboard';
import GoogleRegistration from './Components/googleRegistration';
import EditComplaint from './Components/editComplain';
import ComplaintDetails from './Components/complaintDetails';
import ViewHistory from './Components/viewHistory';
import EmailVerified from './Components/emailVerified';
import AdminHomepage from './Components/adminHomepage';
import AdminAccess from './Components/adminAccess';
import AdminViewAllCom from './Components/adminViewAllCom';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
    <Navbar/>
    <Routes> 
      <Route path='/' element={<Homepage/>}/>
      <Route path='/register' element={<Register/>}/>
      <Route path='/login' element={<Login/>}/>
      <Route path='/forget-password' element={<ForgetPassword />} />
      <Route path='/reset-password/:id' element={<ResetPassword />} />
      <Route path='/lodge-complaint' element={<LodgeComplaint />} />
      <Route path='/dashboard' element={<Dashboard />} />
      <Route path='/google-registration' element={<GoogleRegistration/>} />
      <Route path='/edit-complaint/:id' element={<EditComplaint />} />
      <Route path='/complaint-details/:id' element={<ComplaintDetails />} />
      <Route path='/view-edit-history/:id' element={<ViewHistory />} />
      <Route path='/email-verified/:verificationToken' element={<EmailVerified />} />
      <Route path='/admin-homepage' element={<AdminHomepage/>}/>
      <Route path='/admin-access' element={<AdminAccess/>}/>
      <Route path='/admin-view-all-complaints' element={<AdminViewAllCom/>}/>
    </Routes>
    <Footer/>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

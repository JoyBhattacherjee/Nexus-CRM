import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Leads from './pages/Leads';
import Deals from './pages/Deals';
import Contacts from './pages/Contacts';
import Tasks from './pages/Tasks';
import Learning from './pages/Learning';
import Team from './pages/Team';
import './styles/app.css';

function Protected(){const {user}=useAuth();return user?<Layout/>:<Navigate to="/login" replace/>}
function TeamRoute(){const {isAdmin}=useAuth();return isAdmin?<Team/>:<Navigate to="/" replace/>}
function App(){return <Routes><Route path="/login" element={<Login/>}/><Route element={<Protected/>}><Route path="/" element={<Dashboard/>}/><Route path="/leads" element={<Leads/>}/><Route path="/deals" element={<Deals/>}/><Route path="/contacts" element={<Contacts/>}/><Route path="/tasks" element={<Tasks/>}/><Route path="/learning" element={<Learning/>}/><Route path="/team" element={<TeamRoute/>}/></Route><Route path="*" element={<Navigate to="/" replace/>}/></Routes>}
ReactDOM.createRoot(document.getElementById('root')).render(<React.StrictMode><BrowserRouter><AuthProvider><App/></AuthProvider></BrowserRouter></React.StrictMode>);

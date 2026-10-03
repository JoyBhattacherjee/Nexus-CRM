import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { BarChart3, BookOpen, BriefcaseBusiness, CheckSquare, ContactRound, LogOut, Menu, Search, Sparkles, Target, Users, X } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const nav=[
  ['Dashboard','/',BarChart3],['Leads','/leads',Target],['Deals','/deals',BriefcaseBusiness],['Contacts','/contacts',ContactRound],['Tasks','/tasks',CheckSquare],['Learning','/learning',BookOpen]
];
export default function Layout(){
  const [open,setOpen]=useState(false);const {user,logout,isAdmin}=useAuth();const location=useLocation();
  const title=nav.find(x=>x[1]===location.pathname)?.[0]||(location.pathname==='/team'?'Team':'Nexus CRM');
  return <div className="app-shell">
    <aside className={`sidebar ${open?'open':''}`}>
      <div className="brand"><div className="brand-mark"><Sparkles size={18}/></div><div><strong>Nexus</strong><span>CRM + LMS</span></div><button className="mobile-close" onClick={()=>setOpen(false)}><X size={19}/></button></div>
      <nav>{nav.map(([label,path,Icon])=><NavLink key={path} to={path} onClick={()=>setOpen(false)} className={({isActive})=>isActive?'active':''}><Icon size={18}/><span>{label}</span></NavLink>)}{isAdmin&&<NavLink to="/team" onClick={()=>setOpen(false)} className={({isActive})=>isActive?'active':''}><Users size={18}/><span>Team</span></NavLink>}</nav>
      <div className="sidebar-bottom"><div className="role-card"><span className="avatar small">{user?.avatar||user?.name?.split(' ').map(x=>x[0]).join('').slice(0,2)}</span><div><strong>{user?.name}</strong><span>{user?.role?.replace('_',' ')}</span></div></div><button className="logout" onClick={logout}><LogOut size={17}/> Sign out</button></div>
    </aside>
    {open&&<div className="mobile-overlay" onClick={()=>setOpen(false)}/>} 
    <main className="main"><header className="topbar"><button className="menu-btn" onClick={()=>setOpen(true)}><Menu size={21}/></button><div><p className="eyebrow">Nexus workspace</p><h1>{title}</h1></div><div className="top-actions"><div className="search"><Search size={16}/><input placeholder="Search workspace..."/></div><span className="avatar">{user?.avatar||'NU'}</span></div></header><div className="content"><Outlet/></div></main>
  </div>
}

import { createContext, useContext, useMemo, useState } from 'react';
import api from '../lib/api';

const AuthContext=createContext(null);
export function AuthProvider({children}){
  const [user,setUser]=useState(()=>{try{return JSON.parse(localStorage.getItem('nexus_user'))}catch{return null}});
  const login=async(email,password)=>{const {data}=await api.post('/auth/login',{email,password});localStorage.setItem('nexus_token',data.token);localStorage.setItem('nexus_user',JSON.stringify(data.user));setUser(data.user);return data.user;};
  const logout=()=>{localStorage.removeItem('nexus_token');localStorage.removeItem('nexus_user');setUser(null)};
  const value=useMemo(()=>({user,login,logout,isAdmin:['ADMIN','SUPERADMIN'].includes(user?.role),isSuper:user?.role==='SUPERADMIN'}),[user]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export const useAuth=()=>useContext(AuthContext);

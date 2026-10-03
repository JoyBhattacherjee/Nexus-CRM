import { useEffect, useMemo, useState } from 'react';
import { BookOpen, CircleDollarSign, ListTodo, Target, Users } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import api from '../lib/api';
import StatCard from '../components/StatCard';

const labels={PROSPECTING:'Prospecting',QUALIFICATION:'Qualification',PROPOSAL:'Proposal',NEGOTIATION:'Negotiation',WON:'Won',LOST:'Lost'};
export default function Dashboard(){
  const [data,setData]=useState(null);const [error,setError]=useState('');
  useEffect(()=>{api.get('/dashboard').then(r=>setData(r.data)).catch(e=>setError(e.response?.data?.message||'Could not load dashboard'))},[]);
  const chart=useMemo(()=>data?.pipeline?.filter(x=>x.stage!=='LOST').map(x=>({...x,label:labels[x.stage]}))||[],[data]);
  if(error)return <div className="error-box">{error}</div>;
  if(!data)return <div className="loading-panel">Loading workspace…</div>;
  const money=(n)=>new Intl.NumberFormat('en-US',{style:'currency',currency:'USD',maximumFractionDigits:0}).format(n);
  return <div className="page-stack">
    <section className="welcome-card"><div><p className="eyebrow">Revenue command center</p><h2>Good to see you. Here’s what needs attention.</h2><p>Live CRM pipeline and learning activity in one portfolio workspace.</p></div><div className="welcome-chip"><CircleDollarSign size={18}/><span>Won revenue</span><strong>{money(data.stats.wonRevenue)}</strong></div></section>
    <section className="stats-grid"><StatCard label="Leads" value={data.stats.leads} meta="Active CRM records" icon={Target}/><StatCard label="Deals" value={data.stats.deals} meta="Across pipeline" icon={CircleDollarSign} tone="violet"/><StatCard label="Open tasks" value={data.stats.openTasks} meta="Needs follow-up" icon={ListTodo} tone="orange"/><StatCard label="Published courses" value={data.stats.courses} meta="Learning catalog" icon={BookOpen} tone="green"/><StatCard label="Team members" value={data.stats.teamMembers} meta="Active users" icon={Users} tone="pink"/></section>
    <section className="two-col"><div className="panel"><div className="panel-head"><div><p className="eyebrow">Pipeline value</p><h3>Revenue by stage</h3></div></div><div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={chart}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="label" tickLine={false} axisLine={false}/><YAxis tickFormatter={v=>`$${v/1000}k`} tickLine={false} axisLine={false}/><Tooltip formatter={(v)=>money(v)}/><Bar dataKey="value" radius={[8,8,2,2]}/></BarChart></ResponsiveContainer></div></div><div className="panel"><div className="panel-head"><div><p className="eyebrow">Recent activity</p><h3>Workspace timeline</h3></div></div><div className="activity-list">{data.activities.map(a=><div className="activity" key={a.id}><span className="avatar small">{a.user.avatar||a.user.name.slice(0,2)}</span><div><strong>{a.user.name}</strong><p>{a.message}</p><span>{new Date(a.createdAt).toLocaleString()}</span></div></div>)}</div></div></section>
  </div>
}

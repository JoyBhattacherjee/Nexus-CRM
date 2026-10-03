export default function StatCard({label,value,icon:Icon,meta,tone='blue'}){
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div><p>{label}</p><h3>{value}</h3><span>{meta}</span></div></div>;
}

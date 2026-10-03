import { X } from 'lucide-react';
export default function Modal({open,title,onClose,children}){
  if(!open)return null;
  return <div className="modal-backdrop" onMouseDown={onClose}><div className="modal" onMouseDown={e=>e.stopPropagation()}><div className="modal-head"><div><p className="eyebrow">Workspace action</p><h2>{title}</h2></div><button className="icon-btn" onClick={onClose}><X size={18}/></button></div>{children}</div></div>;
}

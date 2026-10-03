import { Inbox } from 'lucide-react';
export default function EmptyState({title='No records yet',text='Create your first record to get started.'}){return <div className="empty"><Inbox size={28}/><h3>{title}</h3><p>{text}</p></div>}

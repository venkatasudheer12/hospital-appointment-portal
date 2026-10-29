import { useCallback, useEffect, useState } from 'react';
import { Route, Routes } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Info, X } from 'lucide-react';
import Sidebar from './components/Sidebar.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Doctors from './pages/Doctors.jsx';
import Patients from './pages/Patients.jsx';
import Appointments from './pages/Appointments.jsx';
import { api } from './services/api.js';

export default function App() {
  const [doctors, setDoctors] = useState([]); const [patients, setPatients] = useState([]); const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true); const [loadError, setLoadError] = useState(''); const [toast, setToast] = useState(null);
  const notify = useCallback((message, type = 'info') => setToast({ message, type, id: Date.now() }), []);
  const refresh = useCallback(async () => {
    const [d, p, a] = await Promise.all([api.list('doctors'), api.list('patients'), api.list('appointments')]);
    setDoctors(d); setPatients(p); setAppointments(a); setLoadError('');
  }, []);
  useEffect(() => { let active = true; Promise.all([api.list('doctors'), api.list('patients'), api.list('appointments')]).then(([d,p,a]) => { if (active) { setDoctors(d); setPatients(p); setAppointments(a); setLoading(false); } }).catch(() => { if (active) { setLoadError('Could not connect to JSON Server. Start it with "npm run server" in a second terminal, then refresh this page.'); setLoading(false); } }); return () => { active = false; }; }, []);
  useEffect(() => { if (!toast) return; const timer = setTimeout(() => setToast(null), 4200); return () => clearTimeout(timer); }, [toast]);
  const create = async (resource, data) => { await api.create(resource, data); await refresh(); };
  const update = async (resource, id, data) => { await api.update(resource, id, data); await refresh(); };
  const remove = async (resource, id) => { await api.remove(resource, id); await refresh(); };
  return <div className="app-shell"><Sidebar /><main className="main-area"><Header />{loadError && <div className="connection-error"><AlertCircle size={20} /><div><strong>API connection unavailable</strong><p>{loadError}</p></div><button className="button button-soft" onClick={() => { setLoading(true); refresh().then(() => setLoading(false)).catch(() => { setLoadError('Still unable to connect. Check that JSON Server is running on port 3000.'); setLoading(false); }); }}>Retry</button></div>}{loading ? <div className="loading-screen"><div className="loading-spinner"/><strong>Loading hospital records...</strong><span>Connecting to your local API</span></div> : <Routes><Route path="/" element={<Dashboard doctors={doctors} patients={patients} appointments={appointments} />} /><Route path="/doctors" element={<Doctors doctors={doctors} onCreate={data => create('doctors', data)} onUpdate={(id,data) => update('doctors', id, data)} onDelete={id => remove('doctors', id)} notify={notify} />} /><Route path="/patients" element={<Patients patients={patients} onCreate={data => create('patients', data)} onUpdate={(id,data) => update('patients', id, data)} onDelete={id => remove('patients', id)} notify={notify} />} /><Route path="/appointments" element={<Appointments appointments={appointments} doctors={doctors} patients={patients} onCreate={data => create('appointments', data)} onUpdate={(id,data) => update('appointments', id, data)} onDelete={id => remove('appointments', id)} notify={notify} />} /><Route path="*" element={<div className="page-content"><div className="empty-card"><h2>Page not found</h2><p>The page you are looking for does not exist.</p><a className="button button-primary" href="/">Return to dashboard</a></div></div>} /></Routes>}</main>{toast && <div className={`toast toast-${toast.type}`} role="status">{toast.type === 'success' ? <CheckCircle2 size={20} /> : toast.type === 'error' ? <AlertCircle size={20} /> : <Info size={20} />}<span>{toast.message}</span><button onClick={() => setToast(null)} aria-label="Dismiss notification"><X size={16} /></button></div>}</div>;
}

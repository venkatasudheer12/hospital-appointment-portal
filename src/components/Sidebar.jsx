import { NavLink } from 'react-router-dom';
import { Activity, CalendarDays, LayoutDashboard, Stethoscope, Users, HeartPulse } from 'lucide-react';

const links = [
  { to: '/', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/doctors', label: 'Doctors', icon: Stethoscope },
  { to: '/patients', label: 'Patients', icon: Users },
  { to: '/appointments', label: 'Appointments', icon: CalendarDays }
];

export default function Sidebar() {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><HeartPulse size={23} /></div><div><strong>CarePoint</strong><span>Hospital Portal</span></div></div>
    <div className="nav-caption">WORKSPACE</div>
    <nav>{links.map(({ to, label, icon: Icon, end }) => <NavLink key={to} to={to} end={end} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}><Icon size={19} /><span>{label}</span></NavLink>)}</nav>
    <div className="sidebar-bottom"><div className="support-icon"><Activity size={18} /></div><div><strong>Care that connects</strong><span>Manage your clinic with ease.</span></div></div>
    <div className="sidebar-footer">© 2026 CarePoint</div>
  </aside>;
}

import { Bell, Search } from 'lucide-react';
import { useLocation } from 'react-router-dom';

const titles = { '/': ['Overview', 'Here is what is happening at your hospital today.'], '/doctors': ['Doctors', 'Manage your medical team and availability.'], '/patients': ['Patients', 'Keep patient details organized and up to date.'], '/appointments': ['Appointments', 'Schedule visits and track appointment status.'] };
export default function Header() {
  const location = useLocation();
  const [title, subtitle] = titles[location.pathname] || titles['/'];
  return <header className="topbar"><div className="page-heading"><div className="eyebrow">HOSPITAL MANAGEMENT</div><h1>{title}</h1><p>{subtitle}</p></div><div className="topbar-actions"><div className="global-search"><Search size={17} /><span>CarePoint Portal</span></div><button className="icon-button" aria-label="Notifications"><Bell size={19} /><i /></button><div className="profile-avatar">DS</div><div className="profile-copy"><strong>Hospital Staff</strong><span>Administrator</span></div></div></header>;
}

import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  CalendarCheck,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Download,
  HeartPulse,
  MoreHorizontal,
  Plus,
  Stethoscope,
  Users,
} from 'lucide-react';

import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import StatusBadge from '../components/StatusBadge.jsx';

const dateLabel = (value) =>
  value
    ? new Date(`${value}T00:00:00`).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : '—';

// Illustrative trend data until historical analytics are stored by your API.
const trendData = [
  { month: 'Jan', patients: 98, treatments: 72 },
  { month: 'Feb', patients: 151, treatments: 100 },
  { month: 'Mar', patients: 145, treatments: 102 },
  { month: 'Apr', patients: 158, treatments: 150 },
  { month: 'May', patients: 126, treatments: 130 },
  { month: 'Jun', patients: 115, treatments: 52 },
  { month: 'Jul', patients: 128, treatments: 82 },
  { month: 'Aug', patients: 98, treatments: 101 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;

  return (
    <div className="analytics-tooltip">
      <strong>{label}</strong>
      {payload.map((item) => (
        <div key={item.dataKey}>
          <span
            className="tooltip-dot"
            style={{ background: item.color }}
          />
          {item.name}: {item.value}
        </div>
      ))}
    </div>
  );
};

function MetricCard({
  title,
  value,
  change,
  note,
  icon: Icon,
  color,
  positive = true,
}) {
  const ChangeIcon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <article className="metric-card">
      <div className="metric-card-heading">
        <div className={`metric-icon ${color}`}>
          <Icon size={17} />
        </div>
        <span>{title}</span>
        <button className="metric-more" aria-label={`More about ${title}`}>
          <MoreHorizontal size={18} />
        </button>
      </div>

      <div className="metric-number">{value}</div>

      <div className={`metric-change ${positive ? 'positive' : 'negative'}`}>
        <ChangeIcon size={14} />
        <strong>{change}</strong>
        <span>vs previous period</span>
      </div>

      <p className="metric-note">{note}</p>
    </article>
  );
}

export default function Dashboard({ doctors, patients, appointments }) {
  const stats = useMemo(() => {
    const completed = appointments.filter(
      (a) => a.status === 'Completed'
    ).length;

    const active = appointments.filter((a) =>
      ['Booked', 'Confirmed'].includes(a.status)
    ).length;

    const cancelled = appointments.filter(
      (a) => a.status === 'Cancelled'
    ).length;

    const availableDoctors = doctors.filter((d) => d.available).length;

    const completionRate = appointments.length
      ? Math.round((completed / appointments.length) * 100)
      : 0;

    const cancellationRate = appointments.length
      ? Math.round((cancelled / appointments.length) * 100)
      : 0;

    return {
      completed,
      active,
      cancelled,
      availableDoctors,
      completionRate,
      cancellationRate,
    };
  }, [doctors, appointments]);

  const latest = [...appointments]
    .sort((a, b) =>
      `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`)
    )
    .slice(0, 5);

  const patientName = (id) =>
    patients.find((p) => String(p.id) === String(id))?.name ||
    'Unknown patient';

  const doctorName = (id) =>
    doctors.find((d) => String(d.id) === String(id))?.name ||
    'Unknown doctor';

  const today = new Date().toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  const exportAppointments = () => {
    const headers = [
      'Appointment ID',
      'Patient',
      'Doctor',
      'Date',
      'Time',
      'Reason',
      'Status',
    ];

    const rows = appointments.map((a) => [
      a.id,
      patientName(a.patientId),
      doctorName(a.doctorId),
      a.date,
      a.time,
      a.reason,
      a.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? '').replace(/"/g, '""')}"`)
          .join(',')
      )
      .join('\n');

    const blob = new Blob(['\uFEFF' + csv], {
      type: 'text/csv;charset=utf-8;',
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');

    link.href = url;
    link.download = 'carepoint-appointments.csv';
    link.click();

    URL.revokeObjectURL(url);
  };

  return (
    <div className="page-content carepoint-dashboard">
      {/* Dashboard heading */}
      <section className="dashboard-toolbar">
        <div>
          <div className="dashboard-eyebrow">
            <Activity size={14} />
            HOSPITAL ANALYTICS
          </div>

          <h2>Hospital Overview</h2>
          <p>Monitor your hospital's activity and patient care.</p>
        </div>

        <div className="dashboard-toolbar-actions">
          <div className="last-updated">
            <Clock3 size={14} />
            Updated {today}
          </div>

          <button
            type="button"
            className="dashboard-export"
            onClick={exportAppointments}
          >
            <Download size={15} />
            Export
          </button>
        </div>
      </section>

      {/* Real database metrics */}
      <section className="metrics-grid">
        <MetricCard
          title="Registered Patients"
          value={patients.length.toLocaleString('en-IN')}
          change="Live"
          note="Total registered patient records"
          icon={Users}
          color="metric-teal"
        />

        <MetricCard
          title="Available Doctors"
          value={stats.availableDoctors.toLocaleString('en-IN')}
          change={`${doctors.length} total`}
          note="Doctors currently marked available"
          icon={Stethoscope}
          color="metric-blue"
        />

        <MetricCard
          title="Appointments"
          value={appointments.length.toLocaleString('en-IN')}
          change={`${stats.active} active`}
          note="Total appointments in your records"
          icon={CalendarCheck}
          color="metric-purple"
        />

        <MetricCard
          title="Completed Visits"
          value={stats.completed.toLocaleString('en-IN')}
          change={`${stats.completionRate}%`}
          note="Share of appointments completed"
          icon={HeartPulse}
          color="metric-orange"
          positive={stats.cancellationRate === 0}
        />
      </section>

      {/* Analytics row */}
      <section className="analytics-grid">
        <article className="dashboard-panel trend-panel">
          <div className="dashboard-panel-heading">
            <div className="panel-title-icon">
              <Activity size={17} />
            </div>

            <div className="panel-title-copy">
              <h3>Hospital Activity Trends</h3>
              <p>Illustrative monthly analytics</p>
            </div>

            <span className="panel-period">Jan – Aug</span>
          </div>

          <div className="trend-legend">
            <span>
              <i className="legend-teal" />
              Patient visits
            </span>

            <span>
              <i className="legend-blue" />
              Treatment activity
            </span>
          </div>

          <div className="trend-chart">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={trendData}
                margin={{ top: 10, right: 10, left: -22, bottom: 0 }}
              >
                <CartesianGrid
                  stroke="#edf1f5"
                  strokeDasharray="3 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8491a3', fontSize: 11 }}
                  dy={8}
                />

                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#8491a3', fontSize: 10 }}
                  domain={[0, 200]}
                  ticks={[0, 50, 100, 150, 200]}
                />

                <Tooltip content={<CustomTooltip />} />

                <Line
                  type="monotone"
                  dataKey="patients"
                  name="Patient visits"
                  stroke="#08b9a8"
                  strokeWidth={2.4}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, fill: '#ffffff' }}
                  animationDuration={1200}
                />

                <Line
                  type="monotone"
                  dataKey="treatments"
                  name="Treatment activity"
                  stroke="#5548ff"
                  strokeWidth={2.2}
                  dot={false}
                  activeDot={{ r: 5, strokeWidth: 2, fill: '#ffffff' }}
                  animationDuration={1400}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="chart-footnote">
            <span className="footnote-dot" />
            Sample visualization — historical analytics are not yet connected.
          </div>
        </article>

        {/* Effectiveness-style gauge based on actual appointment completion */}
        <article className="dashboard-panel effectiveness-panel">
          <div className="dashboard-panel-heading">
            <div className="panel-title-icon">
              <HeartPulse size={17} />
            </div>

            <div className="panel-title-copy">
              <h3>Appointment Overview</h3>
              <p>Current appointment records</p>
            </div>
          </div>

          <div
            className="gauge-wrap"
            role="img"
            aria-label={`${stats.completionRate} percent of appointments completed`}
          >
            <div className="gauge-track" />
            <div className="gauge-cover">
              <strong>{stats.completionRate}%</strong>
              <span>Completed</span>
            </div>
          </div>

          <div className="effectiveness-legend">
            <div>
              <span className="legend-dot dot-teal" />
              <span>Completed visits</span>
              <strong>{stats.completed}</strong>
            </div>

            <div>
              <span className="legend-dot dot-blue" />
              <span>Booked / confirmed</span>
              <strong>{stats.active}</strong>
            </div>

            <div>
              <span className="legend-dot dot-orange" />
              <span>Cancelled</span>
              <strong>{stats.cancelled}</strong>
            </div>
          </div>
        </article>
      </section>

      {/* Clinical performance table */}
      <section className="dashboard-panel clinical-panel">
        <div className="dashboard-panel-heading clinical-heading">
          <div className="panel-title-icon">
            <CalendarClock size={17} />
          </div>

          <div className="panel-title-copy">
            <h3>Recent Appointment Report</h3>
            <p>Patient visits and appointment status</p>
          </div>

          <div className="clinical-actions">
            <button
              type="button"
              className="dashboard-export"
              onClick={exportAppointments}
            >
              <Download size={14} />
              Export
            </button>

            <Link to="/appointments" className="dashboard-view-all">
              View all <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>

        {latest.length > 0 ? (
          <div className="table-wrap clinical-table-wrap">
            <table className="clinical-table">
              <thead>
                <tr>
                  <th>Patient</th>
                  <th>Doctor</th>
                  <th>Appointment date</th>
                  <th>Visit reason</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {latest.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>
                      <div className="clinical-person">
                        <div className="clinical-avatar">
                          {patientName(appointment.patientId)
                            .split(' ')
                            .map((part) => part[0])
                            .slice(0, 2)
                            .join('')
                            .toUpperCase()}
                        </div>

                        <div>
                          <strong>{patientName(appointment.patientId)}</strong>
                          <span>{appointment.id}</span>
                        </div>
                      </div>
                    </td>

                    <td>{doctorName(appointment.doctorId)}</td>

                    <td>
                      <div className="clinical-date">
                        <strong>{dateLabel(appointment.date)}</strong>
                        <span>{appointment.time || '—'}</span>
                      </div>
                    </td>

                    <td>
                      <span className="clinical-reason">
                        {appointment.reason || '—'}
                      </span>
                    </td>

                    <td>
                      <StatusBadge status={appointment.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="clinical-empty">
            <CalendarCheck size={28} />
            <strong>No appointments yet</strong>
            <p>Create your first appointment to populate this report.</p>

            <Link to="/appointments" className="dashboard-primary-button">
              <Plus size={16} />
              New appointment
            </Link>
          </div>
        )}

        <div className="clinical-footer">
          <span>
            <CheckCircle2 size={14} />
            Data from your current hospital records
          </span>

          <Link to="/appointments">
            Manage appointments <ArrowUpRight size={14} />
          </Link>
        </div>
      </section>

      {/* Quick access */}
      <section className="dashboard-quick-links">
        <Link to="/doctors" className="dashboard-quick-link">
          <span className="quick-link-icon quick-link-teal">
            <Stethoscope size={18} />
          </span>
          <span>
            <strong>Medical team</strong>
            <small>Manage doctors</small>
          </span>
          <ArrowUpRight size={16} />
        </Link>

        <Link to="/patients" className="dashboard-quick-link">
          <span className="quick-link-icon quick-link-blue">
            <Users size={18} />
          </span>
          <span>
            <strong>Patient directory</strong>
            <small>Manage patient records</small>
          </span>
          <ArrowUpRight size={16} />
        </Link>

        <Link to="/appointments" className="dashboard-quick-link">
          <span className="quick-link-icon quick-link-purple">
            <CalendarClock size={18} />
          </span>
          <span>
            <strong>Appointment schedule</strong>
            <small>Book and track visits</small>
          </span>
          <ArrowUpRight size={16} />
        </Link>
      </section>

      <footer className="dashboard-footer">
        CarePoint Hospital Portal <span>•</span> Better coordination, better care.
      </footer>
    </div>
  );
}
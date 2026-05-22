import { NavLink, Route, Routes } from 'react-router-dom'
import TaskLaunch from './pages/TaskLaunch'
import DagMonitor from './pages/DagMonitor'
import Provenance from './pages/Provenance'
import OntologyGraph from './pages/OntologyGraph'
import ReportView from './pages/ReportView'

const navItems = [
  { to: '/', label: '任务发起' },
  { to: '/dag/demo', label: 'DAG 监控' },
  { to: '/provenance/demo', label: '溯源审计' },
  { to: '/ontology', label: '本体图谱' },
  { to: '/report/demo', label: '报告阅读' },
]

export default function App() {
  return (
    <div className="flex h-full">
      <aside className="w-56 shrink-0 border-r border-slate-800 bg-slate-900 p-4">
        <div className="mb-6 text-lg font-semibold text-blue-400">CompetifyAI</div>
        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `block rounded px-3 py-2 text-sm ${
                  isActive
                    ? 'bg-slate-800 text-slate-100'
                    : 'text-slate-400 hover:bg-slate-800/60 hover:text-slate-100'
                }`
              }
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
      </aside>

      <main className="flex-1 overflow-auto">
        <Routes>
          <Route path="/" element={<TaskLaunch />} />
          <Route path="/dag/:taskId" element={<DagMonitor />} />
          <Route path="/provenance/:reportId" element={<Provenance />} />
          <Route path="/ontology" element={<OntologyGraph />} />
          <Route path="/report/:id" element={<ReportView />} />
        </Routes>
      </main>
    </div>
  )
}

import { useState } from 'react'
import type { ReactNode } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  CalendarDays,
  Megaphone,
  Wallet,
  LogOut,
  Menu,
} from 'lucide-react'

interface DashboardLayoutProps {
  children: ReactNode
}

const menuItems = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Anggota', path: '/anggota', icon: Users },
  { label: 'Divisi', path: '/divisi', icon: FolderKanban },
  { label: 'Agenda', path: '/agenda', icon: CalendarDays },
  { label: 'Pengumuman', path: '/pengumuman', icon: Megaphone },
  { label: 'Kas', path: '/kas', icon: Wallet },
]

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()

  const userJson = localStorage.getItem('user')
  const user = userJson ? JSON.parse(userJson) : null

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  return (
    <div className="min-h-screen bg-gray-100 flex">
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 left-0 h-full bg-white border-r border-gray-200 z-40
          transition-transform duration-300 w-64 flex flex-col
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold text-blue-600 whitespace-nowrap">
            OSIS Management
          </h2>
        </div>

        <nav className="p-2 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-1 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <div className="mb-2">
            <p className="text-sm font-medium text-gray-800 truncate">
              {user?.name ?? 'Pengguna'}
            </p>
            <p className="text-xs text-gray-500 truncate">{user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 w-full px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-4">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg hover:bg-gray-100"
          >
            <Menu size={22} />
          </button>
        </header>

        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
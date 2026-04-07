import { Outlet } from 'react-router-dom'
import Sidebar from '../components/layout/Sidebar'
import MainHeader from '../components/layout/MainHeader'

export default function AdminLayout() {
  return (
    <div className="flex flex-col h-screen overflow-hidden bg-surface">
      {/* Full-width top header */}
      <MainHeader />

      {/* Below header: sidebar + content */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

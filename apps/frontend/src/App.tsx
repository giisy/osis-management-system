import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import DashboardPage from './pages/DashboardPage'
import AnggotaPage from './pages/AnggotaPage'
import AnggotaCreatePage from './pages/AnggotaCreatePage'
import AnggotaEditPage from './pages/AnggotaEditPage'
import DivisiPage from './pages/DivisiPage'
import DivisiCreatePage from './pages/DivisiCreatePage'
import DivisiEditPage from './pages/DivisiEditPage'
import AgendaPage from './pages/AgendaPage'
import AgendaCreatePage from './pages/AgendaCreatePage'
import AgendaEditPage from './pages/AgendaEditPage'
import PengumumanPage from './pages/PengumumanPage'
import PengumumanCreatePage from './pages/PengumumanCreatePage'
import PengumumanEditPage from './pages/PengumumanEditPage'
import KasPage from './pages/KasPage'
import KasCreatePage from './pages/KasCreatePage'
import KasEditPage from './pages/KasEditPage'
import BarangPage from './pages/BarangPage'
import BarangCreatePage from './pages/BarangCreatePage'
import BarangEditPage from './pages/BarangEditPage'
import PeminjamanPage from './pages/PeminjamanPage'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'
import VotingPage from './pages/VotingPage'
import VotingCreatePage from './pages/VotingCreatePage'
import VotingDetailPage from './pages/VotingDetailPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DashboardPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/anggota"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnggotaPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/anggota/create"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnggotaCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/anggota/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AnggotaEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/divisi"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DivisiPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/divisi/create"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DivisiCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/divisi/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <DivisiEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agenda"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AgendaPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agenda/create"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AgendaCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agenda/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <AgendaEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengumuman"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PengumumanPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengumuman/create"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PengumumanCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengumuman/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PengumumanEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kas"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <KasPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kas/create"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <KasCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/kas/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <KasEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventaris"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BarangPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventaris/create"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BarangCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventaris/:id/edit"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <BarangEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/peminjaman"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <PeminjamanPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/voting"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <VotingPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/voting/create"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <VotingCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/voting/:id"
          element={
            <ProtectedRoute>
              <DashboardLayout>
                <VotingDetailPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
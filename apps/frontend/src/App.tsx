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
import UnauthorizedPage from './pages/UnauthorizedPage'

// Role yang boleh CRUD penuh Anggota (SUPER_ADMIN, ADMIN)
const ANGGOTA_MANAGE = ['SUPER_ADMIN', 'ADMIN'] as const
// Role yang boleh lihat data Anggota (semua kecuali ANGGOTA sendiri)
const ANGGOTA_VIEW = ['SUPER_ADMIN', 'ADMIN', 'SEKRETARIS', 'BENDAHARA', 'KOORDINATOR_DIVISI', 'PEMBINA'] as const
// Role yang boleh manage Divisi
const DIVISI_MANAGE = ['SUPER_ADMIN', 'ADMIN'] as const
// Role yang boleh buat/edit Agenda (Penuh + Buat/Edit)
const AGENDA_MANAGE = ['SUPER_ADMIN', 'ADMIN', 'SEKRETARIS', 'KOORDINATOR_DIVISI'] as const
// Role yang boleh buat/edit Pengumuman (Penuh + Buat/Edit)
const PENGUMUMAN_MANAGE = ['SUPER_ADMIN', 'ADMIN', 'SEKRETARIS'] as const
// Kas catat — BENDAHARA saja (sesuai matriks final, S/A TIDAK termasuk)
const KAS_EDIT_ACCESS = ['BENDAHARA', 'SUPER_ADMIN'] as const
// Role yang boleh manage Inventaris
const INVENTARIS_MANAGE = ['SUPER_ADMIN', 'ADMIN'] as const
// Voting buat/edit sesi (Penuh + Buat/Edit)
const VOTING_MANAGE = ['SUPER_ADMIN', 'ADMIN', 'SEKRETARIS'] as const

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
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
        {/* Anggota — Lihat: semua kecuali ANGGOTA. Kelola: SUPER_ADMIN, ADMIN */}
        <Route
          path="/anggota"
          element={
            <ProtectedRoute allowedRoles={[...ANGGOTA_VIEW]}>
              <DashboardLayout>
                <AnggotaPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/anggota/create"
          element={
            <ProtectedRoute allowedRoles={[...ANGGOTA_MANAGE]}>
              <DashboardLayout>
                <AnggotaCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/anggota/:id/edit"
          element={
            <ProtectedRoute allowedRoles={[...ANGGOTA_MANAGE]}>
              <DashboardLayout>
                <AnggotaEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* Divisi — Lihat: semua role (termasuk ANGGOTA), jadi tanpa allowedRoles */}
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
            <ProtectedRoute allowedRoles={[...DIVISI_MANAGE]}>
              <DashboardLayout>
                <DivisiCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/divisi/:id/edit"
          element={
            <ProtectedRoute allowedRoles={[...DIVISI_MANAGE]}>
              <DashboardLayout>
                <DivisiEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* Agenda — Lihat: semua role, jadi tanpa allowedRoles */}
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
            <ProtectedRoute allowedRoles={[...AGENDA_MANAGE]}>
              <DashboardLayout>
                <AgendaCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/agenda/:id/edit"
          element={
            <ProtectedRoute allowedRoles={[...AGENDA_MANAGE]}>
              <DashboardLayout>
                <AgendaEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* Pengumuman — Lihat: semua role, jadi tanpa allowedRoles */}
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
            <ProtectedRoute allowedRoles={[...PENGUMUMAN_MANAGE]}>
              <DashboardLayout>
                <PengumumanCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/pengumuman/:id/edit"
          element={
            <ProtectedRoute allowedRoles={[...PENGUMUMAN_MANAGE]}>
              <DashboardLayout>
                <PengumumanEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* Kas — baca: semua role. Catat: BENDAHARA saja */}
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
            <ProtectedRoute allowedRoles={[...KAS_EDIT_ACCESS]}>
              <DashboardLayout>
                <KasCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
  path="/kas/:id/edit"
  element={
    <ProtectedRoute allowedRoles={[...KAS_EDIT_ACCESS]}>
      <DashboardLayout>
        <KasEditPage />
      </DashboardLayout>
    </ProtectedRoute>
  }
/>
        {/* Inventaris — Lihat: semua role, jadi tanpa allowedRoles */}
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
            <ProtectedRoute allowedRoles={[...INVENTARIS_MANAGE]}>
              <DashboardLayout>
                <BarangCreatePage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/inventaris/:id/edit"
          element={
            <ProtectedRoute allowedRoles={[...INVENTARIS_MANAGE]}>
              <DashboardLayout>
                <BarangEditPage />
              </DashboardLayout>
            </ProtectedRoute>
          }
        />
        {/* Peminjaman — create untuk diri sendiri: semua role boleh */}
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
        {/* Voting — lihat & vote: semua role. Buat/edit sesi: dibatasi */}
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
            <ProtectedRoute allowedRoles={[...VOTING_MANAGE]}>
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
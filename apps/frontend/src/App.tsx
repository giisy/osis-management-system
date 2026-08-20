import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import AnggotaPage from './pages/AnggotaPage'
import AnggotaCreatePage from './pages/AnggotaCreatePage'
import AnggotaEditPage from './pages/AnggotaEditPage'
import DivisiPage from './pages/DivisiPage'
import DivisiCreatePage from './pages/DivisiCreatePage'
import DivisiEditPage from './pages/DivisiEditPage'
import ProtectedRoute from './components/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
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
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
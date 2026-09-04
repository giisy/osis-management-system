import { Link } from 'react-router-dom'
import { ShieldAlert } from 'lucide-react'

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="text-center">
        <ShieldAlert size={48} className="mx-auto text-red-500 mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
        <p className="text-gray-500 mb-6">Kamu tidak punya izin untuk membuka halaman ini.</p>
        <Link
          to="/dashboard"
          className="inline-block bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition"
        >
          Kembali ke Dashboard
        </Link>
      </div>
    </div>
  )
}
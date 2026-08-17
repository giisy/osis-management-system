import { Mail, Phone, GraduationCap } from 'lucide-react'
import type { Anggota } from './anggotaApi'

interface AnggotaCardProps {
  anggota: Anggota
}

const roleColors: Record<string, string> = {
  SUPER_ADMIN: 'bg-purple-50 text-purple-600',
  ADMIN: 'bg-orange-50 text-orange-600',
  KETUA: 'bg-blue-50 text-blue-600',
  ANGGOTA: 'bg-gray-100 text-gray-600',
}

export default function AnggotaCard({ anggota }: AnggotaCardProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4">
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-semibold text-gray-800">{anggota.name}</p>
          {anggota.divisi && (
            <p className="text-xs text-gray-400">{anggota.divisi.nama}</p>
          )}
        </div>
        <span
          className={`text-xs font-medium px-2 py-1 rounded-full ${
            roleColors[anggota.role] ?? 'bg-gray-100 text-gray-600'
          }`}
        >
          {anggota.role}
        </span>
      </div>

      <div className="space-y-1 mt-3 text-sm text-gray-500">
        <div className="flex items-center gap-2">
          <Mail size={14} />
          <span className="truncate">{anggota.email}</span>
        </div>
        {anggota.noTelepon && (
          <div className="flex items-center gap-2">
            <Phone size={14} />
            <span>{anggota.noTelepon}</span>
          </div>
        )}
        {anggota.kelas && (
          <div className="flex items-center gap-2">
            <GraduationCap size={14} />
            <span>{anggota.kelas}</span>
          </div>
        )}
      </div>
    </div>
  )
}
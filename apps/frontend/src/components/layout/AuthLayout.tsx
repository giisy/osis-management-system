import type { ReactNode } from 'react'
import { CalendarDays, Wallet, Vote } from 'lucide-react'

interface AuthLayoutProps {
  title: string
  subtitle: string
  children: ReactNode
}

const previewCards = [
  { icon: CalendarDays, label: 'Rapat Bulanan OSIS', meta: '25 Agustus, 08.00', rotate: '-rotate-2' },
  { icon: Wallet, label: 'Saldo Kas', meta: 'Rp 4.250.000', rotate: 'rotate-1' },
  { icon: Vote, label: 'Pemilihan Ketua OSIS', meta: '142 suara masuk', rotate: '-rotate-1' },
]

export default function AuthLayout({ title, subtitle, children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen flex bg-white">
      <div className="hidden md:flex md:w-1/2 lg:w-2/5 bg-[#0B1220] relative overflow-hidden flex-col justify-between p-10">
        <div>
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center font-bold text-sm">
              O
            </div>
            <span className="font-semibold">OSIS Management</span>
          </div>

          <h1 className="text-3xl font-semibold text-white mt-16 leading-snug max-w-xs">
            Kelola agenda, kas, dan voting organisasi dalam satu tempat.
          </h1>
          <p className="text-slate-400 mt-4 max-w-xs text-sm leading-relaxed">
            Satu dashboard untuk seluruh kegiatan OSIS — dari rapat sampai laporan keuangan.
          </p>
        </div>

        <div className="relative h-56">
          {previewCards.map((card, i) => {
            const Icon = card.icon
            return (
              <div
                key={card.label}
                className={`absolute bg-white/95 rounded-xl p-4 w-56 shadow-xl ${card.rotate}`}
                style={{ top: i * 48, left: i * 28 }}
              >
                <div className="flex items-center gap-2 text-blue-600 mb-1">
                  <Icon size={16} />
                  <span className="text-xs font-medium text-slate-500">{card.label}</span>
                </div>
                <p className="text-sm font-semibold text-slate-800">{card.meta}</p>
              </div>
            )
          })}
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-sm">
          <div className="md:hidden flex items-center gap-2 mb-10">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
              O
            </div>
            <span className="font-semibold text-slate-800">OSIS Management</span>
          </div>

          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          <p className="text-slate-500 text-sm mt-1 mb-8">{subtitle}</p>

          {children}
        </div>
      </div>
    </div>
  )
}
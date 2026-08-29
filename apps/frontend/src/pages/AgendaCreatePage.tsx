import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import AgendaForm from '../features/agenda/AgendaForm'
import { useCreateAgenda } from '../features/agenda/useAgendaMutation'
import type { AgendaPayload } from '../features/agenda/agendaApi'

export default function AgendaCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const defaultDate = searchParams.get('date') ?? undefined
  const createMutation = useCreateAgenda()

  const handleSubmit = (data: AgendaPayload) => {
    createMutation.mutate(data, {
      onSuccess: () => {
        navigate('/agenda')
      },
    })
  }

  return (
    <div>
      <button
        onClick={() => navigate('/agenda')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Tambah Agenda</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <AgendaForm
          defaultDate={defaultDate}
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitError={createMutation.error}
        />
      </div>
    </div>
  )
}
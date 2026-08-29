import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import VotingForm from '../features/voting/VotingForm'
import { useCreateVoting } from '../features/voting/useVoting'
import type { VotingFormValues } from '../features/voting/votingSchema'

export default function VotingCreatePage() {
  const navigate = useNavigate()
  const createMutation = useCreateVoting()

  const handleSubmit = (data: VotingFormValues) => {
    createMutation.mutate(
      {
        judul: data.judul,
        deskripsi: data.deskripsi,
        pilihan: data.pilihan.map((p) => p.value),
      },
      {
        onSuccess: () => {
          navigate('/voting')
        },
      }
    )
  }

  return (
    <div>
      <button
        onClick={() => navigate('/voting')}
        className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-4"
      >
        <ArrowLeft size={16} />
        Kembali
      </button>

      <h1 className="text-2xl font-bold text-gray-800 mb-6">Buat Voting</h1>

      <div className="bg-white rounded-xl border border-gray-200 p-4 max-w-lg">
        <VotingForm
          onSubmit={handleSubmit}
          isSubmitting={createMutation.isPending}
          submitError={createMutation.error}
        />
      </div>
    </div>
  )
}
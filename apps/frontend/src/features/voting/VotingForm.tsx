import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { isAxiosError } from 'axios'
import { Plus, X } from 'lucide-react'
import { votingSchema, type VotingFormValues } from './votingSchema'

interface VotingFormProps {
  onSubmit: (data: VotingFormValues) => void
  isSubmitting: boolean
  submitError?: unknown
}

export default function VotingForm({ onSubmit, isSubmitting, submitError }: VotingFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VotingFormValues>({
    resolver: zodResolver(votingSchema),
    defaultValues: {
      pilihan: [{ value: '' }, { value: '' }],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'pilihan',
  })

  const errorMessage = isAxiosError(submitError)
    ? submitError.response?.data?.message
    : null

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Judul</label>
        <input
          {...register('judul')}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {errors.judul && <p className="text-red-500 text-sm mt-1">{errors.judul.message}</p>}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Deskripsi</label>
        <textarea
          {...register('deskripsi')}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Pilihan</label>
        <div className="space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="flex items-center gap-2">
              <input
                {...register(`pilihan.${index}.value`)}
                placeholder={`Pilihan ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              {fields.length > 2 && (
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                >
                  <X size={16} />
                </button>
              )}
            </div>
          ))}
        </div>
        {errors.pilihan && (
          <p className="text-red-500 text-sm mt-1">
            {errors.pilihan.message || errors.pilihan.root?.message}
          </p>
        )}

        {fields.length < 10 && (
          <button
            type="button"
            onClick={() => append({ value: '' })}
            className="flex items-center gap-1 text-sm text-blue-600 hover:underline mt-2"
          >
            <Plus size={14} />
            Tambah pilihan
          </button>
        )}
      </div>

      {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'Menyimpan...' : 'Buat Voting'}
      </button>
    </form>
  )
}
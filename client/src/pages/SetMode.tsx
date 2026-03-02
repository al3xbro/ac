import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'

interface AcStatus {
  id: number
  isOn: boolean
  mode: 'cool' | 'heat' | 'fan' | 'off'
  timestamp: string
}

interface SetModeProps {
  mode: 'cool' | 'heat' | 'fan' | 'off'
}

function SetMode({ mode }: SetModeProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const cached = queryClient.getQueryData<AcStatus | null>(['ac-status'])

  const { mutate, isError } = useMutation({
    mutationFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ac-status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode }),
      })
      if (!res.ok) throw new Error('Failed to update')
      return res.json()
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['ac-status'] })
      navigate('/')
    },
  })

  useEffect(() => {
    mutate()
  }, [mutate])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="border border-neutral-800 rounded-2xl p-8 w-full max-w-sm text-center">
        {isError && <p className="text-red-500 mb-4">Failed to update AC status</p>}

        <div className="opacity-50">
          {cached ? (
            <>
              <p className={`text-4xl font-bold mb-4 ${{cool: 'text-blue-400', heat: 'text-red-400', fan: 'text-green-400', off: 'text-white'}[cached.mode]}`}>
                {cached.mode.toUpperCase()}
              </p>
              <p className="text-neutral-500 text-sm">
              Last updated: {new Date(cached.timestamp).toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-neutral-500">No status yet</p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <button disabled className="bg-neutral-800 text-blue-400 opacity-50 rounded-lg py-3">
            Cool
          </button>
          <button disabled className="bg-neutral-800 text-red-400 opacity-50 rounded-lg py-3">
            Heat
          </button>
          <button disabled className="bg-neutral-800 text-green-400 opacity-50 rounded-lg py-3">
            Fan
          </button>
          <button disabled className="bg-neutral-800 opacity-50 rounded-lg py-3">
            Off
          </button>
        </div>
      </div>
    </div>
  )
}

export default SetMode

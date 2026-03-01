import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

interface SetModeProps {
  mode: 'cool' | 'heat' | 'fan'
}

function SetMode({ mode }: SetModeProps) {
  const navigate = useNavigate()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/ac-status', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ isOn: true, mode }),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to update')
        navigate('/')
      })
      .catch(() => setError('Failed to update AC status'))
  }, [mode, navigate])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="border border-neutral-800 rounded-2xl p-8 w-full max-w-sm text-center">
        {error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <p className="text-neutral-500">Setting to {mode}...</p>
        )}
      </div>
    </div>
  )
}

export default SetMode

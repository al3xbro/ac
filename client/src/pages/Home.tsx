import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

interface AcStatus {
  id: number
  isOn: boolean
  mode: 'cool' | 'heat' | 'fan'
  timestamp: string
}

function Home() {
  const [status, setStatus] = useState<AcStatus | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/ac-status')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch')
        return res.json()
      })
      .then((data) => setStatus(data))
      .catch(() => setStatus(null))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <div className="border border-neutral-800 rounded-2xl p-8 w-full max-w-sm text-center">
        {loading ? (
          <p className="text-neutral-500">Loading...</p>
        ) : status ? (
          <>
            <p className="text-4xl font-bold mb-4">
              {status.isOn ? status.mode.toUpperCase() : 'OFF'}
            </p>
            <p className="text-neutral-500 text-sm">
              {new Date(status.timestamp).toLocaleString()}
            </p>
          </>
        ) : (
          <p className="text-neutral-500">No status yet</p>
        )}

        <div className="mt-8 flex flex-col gap-3">
          <Link to="/cool" className="block bg-neutral-900 hover:bg-neutral-800 rounded-lg py-3 transition">
            Cool
          </Link>
          <Link to="/heat" className="block bg-neutral-900 hover:bg-neutral-800 rounded-lg py-3 transition">
            Heat
          </Link>
          <Link to="/fan" className="block bg-neutral-900 hover:bg-neutral-800 rounded-lg py-3 transition">
            Fan
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

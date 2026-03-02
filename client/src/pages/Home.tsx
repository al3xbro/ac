import { useQuery, keepPreviousData } from '@tanstack/react-query'
import { Link } from 'react-router-dom'

interface AcStatus {
  id: number
  mode: 'cool' | 'heat' | 'fan' | 'off'
  timestamp: string
}

function Home() {
  const { data: status, isLoading, isFetching } = useQuery<AcStatus | null>({
    queryKey: ['ac-status'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/ac-status`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    placeholderData: keepPreviousData,
  })

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 select-none" onContextMenu={e => e.preventDefault()} onDragStart={e => e.preventDefault()}>
      <div className="border border-neutral-800 rounded-2xl p-8 w-full max-w-sm text-center">
        <div className={isFetching ? 'opacity-50 transition' : 'transition'}>
          {isLoading ? (
            <p className="text-neutral-500">Loading...</p>
          ) : status ? (
            <>
              <p className={`text-4xl font-bold mb-4 ${{cool: 'text-sky-400', heat: 'text-red-400', fan: 'text-green-400', off: 'text-white'}[status.mode]}`}>
                {status.mode.toUpperCase()}
              </p>
              <p className="text-neutral-500 text-sm">
                Last updated: {new Date(status.timestamp).toLocaleString()}
              </p>
            </>
          ) : (
            <p className="text-neutral-500">No status yet</p>
          )}
        </div>

        <div className="mt-8 flex flex-col gap-3">
          <Link to="/cool" className="block bg-linear-to-l from-sky-950 to-sky-900 hover:from-sky-900 hover:to-sky-900 active:from-sky-800 active:to-sky-800 text-sky-400 rounded-lg py-3 transition">
            Cool
          </Link>
          <Link to="/heat" className="block bg-linear-to-l from-red-950 to-red-900 hover:from-red-900 hover:to-red-900 active:from-red-800 active:to-red-800 text-red-400 rounded-lg py-3 transition">
            Heat
          </Link>
          <Link to="/fan" className="block bg-linear-to-l from-green-950 to-green-900 hover:from-green-900 hover:to-green-900 active:from-green-800 active:to-green-800 text-green-400 rounded-lg py-3 transition">
            Fan
          </Link>
          <Link to="/off" className="block bg-linear-to-l from-neutral-900 to-neutral-900 hover:from-neutral-800 hover:to-neutral-800 active:from-neutral-700 active:to-neutral-700 rounded-lg py-3 transition">
            Off
          </Link>
        </div>
      </div>
    </div>
  )
}

export default Home

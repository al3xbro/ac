import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query'
import { Link, useSearchParams, useNavigate } from 'react-router-dom'
import { usePushNotifications } from '../hooks/usePushNotifications'

interface AcStatus {
  id: number
  mode: 'cool' | 'heat' | 'fan' | 'off'
  timestamp: string
}

const modes = ['cool', 'heat', 'fan', 'off'] as const

function Home() {
  const queryClient = useQueryClient()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const pendingMode = searchParams.get('set') as AcStatus['mode'] | null

  const { data: status, isLoading } = useQuery<AcStatus | null>({
    queryKey: ['ac-status'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ac-status`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    placeholderData: keepPreviousData,
    refetchInterval: 2000,
  })

  const { mutate, isError } = useMutation({
    mutationFn: async (mode: AcStatus['mode']) => {
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
      navigate('/', { replace: true })
    },
  })

  useEffect(() => {
    if (pendingMode && modes.includes(pendingMode)) {
      mutate(pendingMode)
    }
  }, [pendingMode, mutate])

  const { isSubscribed, isSupported, isLoading: pushLoading, subscribe, unsubscribe } = usePushNotifications()
  const setting = !!pendingMode

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 select-none" onContextMenu={e => e.preventDefault()} onDragStart={e => e.preventDefault()}>
      <div className="border border-neutral-800 rounded-2xl p-8 w-full max-w-sm text-center">
        {isError && <p className="text-red-500 mb-4">Failed to update AC status</p>}

        <div className={setting ? 'opacity-50 transition' : 'transition'}>
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
          {setting ? (
            <>
              <button disabled className="bg-neutral-800 text-sky-400 opacity-50 rounded-lg py-3">Cool</button>
              <button disabled className="bg-neutral-800 text-red-400 opacity-50 rounded-lg py-3">Heat</button>
              <button disabled className="bg-neutral-800 text-green-400 opacity-50 rounded-lg py-3">Fan</button>
              <button disabled className="bg-neutral-800 opacity-50 rounded-lg py-3">Off</button>
            </>
          ) : (
            <>
              <Link to="/?set=cool" className="block bg-linear-to-l from-sky-950 to-sky-900 hover:from-sky-900 hover:to-sky-900 active:from-sky-800 active:to-sky-800 text-sky-400 rounded-lg py-3 transition">
                Cool
              </Link>
              <Link to="/?set=heat" className="block bg-linear-to-l from-red-950 to-red-900 hover:from-red-900 hover:to-red-900 active:from-red-800 active:to-red-800 text-red-400 rounded-lg py-3 transition">
                Heat
              </Link>
              <Link to="/?set=fan" className="block bg-linear-to-l from-green-950 to-green-900 hover:from-green-900 hover:to-green-900 active:from-green-800 active:to-green-800 text-green-400 rounded-lg py-3 transition">
                Fan
              </Link>
              <Link to="/?set=off" className="block bg-linear-to-l from-neutral-900 to-neutral-900 hover:from-neutral-800 hover:to-neutral-800 active:from-neutral-700 active:to-neutral-700 rounded-lg py-3 transition">
                Off
              </Link>
            </>
          )}
        </div>

        {isSupported && (
          <button
            onClick={isSubscribed ? unsubscribe : subscribe}
            disabled={pushLoading}
            className="mt-6 text-sm text-neutral-500 hover:text-neutral-300 transition disabled:opacity-50"
          >
            {pushLoading
              ? 'Loading...'
              : isSubscribed
                ? 'Disable notifications'
                : 'Enable notifications'}
          </button>
        )}
      </div>
    </div>
  )
}

export default Home

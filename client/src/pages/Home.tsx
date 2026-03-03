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

  const { data: status, isLoading, isError: isQueryError } = useQuery<AcStatus | null>({
    queryKey: ['ac-status'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/ac-status`)
      if (!res.ok) throw new Error('Failed to fetch')
      return res.json()
    },
    placeholderData: keepPreviousData,
    refetchInterval: 2000,
  })

  const { mutate, isError: isMutationError } = useMutation({
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

  useEffect(() => {
    const clearNotifications = () => {
      if (document.visibilityState === 'visible' && navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage('clear-notifications')
      }
    }
    clearNotifications()
    document.addEventListener('visibilitychange', clearNotifications)
    return () => document.removeEventListener('visibilitychange', clearNotifications)
  }, [])
  const setting = !!pendingMode

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4 select-none" onContextMenu={e => e.preventDefault()} onDragStart={e => e.preventDefault()}>
      <a href="https://github.com/al3xbro/ac" target="_blank" rel="noopener noreferrer" className="fixed top-4 right-4 text-neutral-600 hover:text-neutral-400 active:text-neutral-400 transition">
        <svg viewBox="0 0 16 16" width="24" height="24" fill="currentColor"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"/></svg>
      </a>
      <div className="border border-neutral-800 rounded-2xl p-8 w-full max-w-sm text-center">
        {(isQueryError || isMutationError) && <p className="text-red-500 mb-4">Failed to fetch...</p>}
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

        {isSupported ? (
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
        ) : (
          <p className="mt-6 text-sm text-neutral-500">
            Notifications unsupported. You may need to add to home screen.
          </p>
        )}
      </div>
    </div>
  )
}

export default Home

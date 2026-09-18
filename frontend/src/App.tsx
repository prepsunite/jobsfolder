import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from '@/lib/router'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ConsentProvider } from '@/contexts/ConsentContext'
import { broadcastQueryClient } from '@tanstack/query-broadcast-client-experimental'

import { ToastProvider } from '@/contexts/ToastContext'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30 * 1000, // 30s default cache to prevent continuous refetches
      gcTime: 10 * 60 * 1000, // 10 minutes cache garbage collection to avoid memory bloat
      retry: 1,
      refetchOnWindowFocus: false, // Avoid sudden network/CPU spikes on alt-tab
    },
  },
})

if (typeof window !== 'undefined') {
  broadcastQueryClient({
    queryClient,
    broadcastChannel: 'prepunite_query_broadcast_channel'
  })
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ConsentProvider>
          <AuthProvider>
            <ToastProvider>
              <RouterProvider router={router} />
            </ToastProvider>
          </AuthProvider>
        </ConsentProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

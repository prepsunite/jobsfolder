import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router'
import { router } from '@/lib/router'
import { AuthProvider } from '@/contexts/AuthContext'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { ConsentProvider } from '@/contexts/ConsentContext'
import ConsentBanner from '@/components/ConsentBanner'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0, // Always refetch — admin changes must be visible immediately
      retry: 1,
      refetchOnWindowFocus: true,
    },
  },
})

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <ConsentProvider>
          <AuthProvider>
            {/* DPDP Act 2023 — Rule 3: Notice before data collection */}
            <ConsentBanner />
            <RouterProvider router={router} />
          </AuthProvider>
        </ConsentProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}

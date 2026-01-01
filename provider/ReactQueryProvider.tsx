// 'use client'

// import { ReactNode, useState } from 'react'
// import { QueryClient } from '@tanstack/react-query'
// import { PersistQueryClientProvider } from '@tanstack/react-query-persist-client'
// import { indexedDBPersister } from '@/utils/queryPersister'

// interface ReactQueryProviderProps {
//   children: ReactNode
// }

// export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
//   const [queryClient] = useState(
//     () =>
//       new QueryClient({
//         defaultOptions: {
//           queries: {
//             staleTime: 24 * 60 * 60 * 1000, // 24 hours
//             gcTime: 24 * 60 * 60 * 1000,    // keep cache 24h
//             refetchOnWindowFocus: false,
//             refetchOnReconnect: false,
//           },
//         },
//       })
//   )

//   return (
//     <PersistQueryClientProvider
//       client={queryClient}
//       persistOptions={{
//         persister: indexedDBPersister,
//         maxAge: 24 * 60 * 60 * 1000, // 24 hours
//       }}
//     >
//       {children}
//     </PersistQueryClientProvider>
//   )
// }


'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactNode, useState } from 'react'

interface ReactQueryProviderProps {
  children: ReactNode
}

export function ReactQueryProvider({ children }: ReactQueryProviderProps) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

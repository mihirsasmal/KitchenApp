import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import {ReactNode} from 'react'

function QueryProvider({children}:{children:ReactNode}) {
    const queryClient = new QueryClient();
  return (
    <QueryClientProvider client = {queryClient}>
{children}
    </QueryClientProvider> )
}

export default QueryProvider
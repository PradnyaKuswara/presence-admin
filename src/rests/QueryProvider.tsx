import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { queryClient as defaultQueryClient } from './queryClient';

export interface QueryProviderProps {
  children: React.ReactNode;
  client?: QueryClient;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children, client }) => {
  const [queryClient] = useState(() => client || defaultQueryClient);

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
};

export default QueryProvider;

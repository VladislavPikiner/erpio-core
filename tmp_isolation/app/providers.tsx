"use client";

import { ApolloClient, InMemoryCache, ApolloProvider, HttpLink } from '@apollo/client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Provider } from 'react-redux';
import { store } from '../lib/store';

const apolloClient = new ApolloClient({
  link: new HttpLink({ uri: 'http://localhost:3000/graphql' }),
  cache: new InMemoryCache(),
});

const queryClient = new QueryClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ApolloProvider client={apolloClient}>
      <QueryClientProvider client={queryClient}>
        <Provider store={store}> 
          {children}
        </Provider>
      </QueryClientProvider>
    </ApolloProvider>
  );
}

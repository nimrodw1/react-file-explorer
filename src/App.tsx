import '@mantine/core/styles.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MantineProvider } from '@mantine/core';
import { Router } from './Router';
import { ServiceProvider } from './services/ServiceContext';
import { theme } from './theme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function App() {
  return (
    <MantineProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <ServiceProvider>
          <Router />
        </ServiceProvider>
      </QueryClientProvider>
    </MantineProvider>
  );
}

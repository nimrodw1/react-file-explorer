import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ExplorerPage } from './pages/Explorer.page';

// Vite always includes a trailing slash; React Router basename must not.
const basename = import.meta.env.BASE_URL.replace(/\/$/, '') || undefined;

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <ExplorerPage />,
    },
  ],
  { basename }
);

export function Router() {
  return <RouterProvider router={router} />;
}

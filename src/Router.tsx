import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ExplorerPage } from './pages/Explorer.page';

const router = createBrowserRouter([
  {
    path: '/',
    element: <ExplorerPage />,
  },
]);

export function Router() {
  return <RouterProvider router={router} />;
}

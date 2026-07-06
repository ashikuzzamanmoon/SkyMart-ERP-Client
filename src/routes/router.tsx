import { createBrowserRouter, Navigate } from 'react-router-dom';
import Login from '../pages/Login';
import Unauthorized from '../pages/Unauthorized';
import ProtectedRoute from './ProtectedRoute';
import RoleRoute from './RoleRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/unauthorized',
    element: <Unauthorized />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        path: '/',
        element: <DashboardLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          {
            path: 'dashboard',
            element: <div>Dashboard Content Coming Soon</div>,
          },
          {
            path: 'products',
            element: (
              <RoleRoute allowedRoles={['admin', 'manager']}>
                <div>Products List Coming Soon</div>
              </RoleRoute>
            ),
          },
          {
            path: 'products/new',
            element: (
              <RoleRoute allowedRoles={['admin', 'manager']}>
                <div>Add Product Coming Soon</div>
              </RoleRoute>
            ),
          },
          {
            path: 'products/:id/edit',
            element: (
              <RoleRoute allowedRoles={['admin', 'manager']}>
                <div>Edit Product Coming Soon</div>
              </RoleRoute>
            ),
          },
          {
            path: 'sales',
            element: (
              <RoleRoute allowedRoles={['admin', 'manager', 'employee']}>
                <div>Sales List Coming Soon</div>
              </RoleRoute>
            ),
          },
          {
            path: 'sales/new',
            element: (
              <RoleRoute allowedRoles={['admin', 'manager', 'employee']}>
                <div>Add Sale Coming Soon</div>
              </RoleRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: '*',
    element: <Navigate to="/dashboard" replace />,
  },
]);

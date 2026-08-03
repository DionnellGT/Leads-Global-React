import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import { DashboardLayout } from "../admin/layout/DashboardLayout"
import { DashboardPage, Leads } from "../admin/pages"
import { LoginPage } from "../auth/pages/LoginPage"
import { AuthLayout } from "../auth/layout/AuthLayout"
import { AdminRoute, NotAuthenticatedRoute } from "@/components/routes/AuthenticatedRoute"


const appRouter = createBrowserRouter([
    //Dasboard routes
    {
        path: '/dashboard',
        element: <AdminRoute>
                    <DashboardLayout/>
                 </AdminRoute>,
        children: [
            {
                index: true,
                element: <DashboardPage/>
            },
            {
                path: 'leads',
                element: <Leads/>
            }
        ]
    },

    //Auth Routes
    {
        path: '/auth',
        element: <NotAuthenticatedRoute>
                    <AuthLayout/>
                 </NotAuthenticatedRoute>,
        children: [
            {
                index: true,
                element: <Navigate to='/auth/login' />
            },
            {
                path: 'login',
                element: <LoginPage/>
            }
        ]
    },

    {
        path: '*',
        element: <Navigate to='/dashboard' />
    },
])

export function AppRouter() {
  return <RouterProvider router={appRouter} />
}
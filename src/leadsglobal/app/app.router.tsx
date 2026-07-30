import { createBrowserRouter, Navigate, RouterProvider } from "react-router"
import { DashboardLayout } from "../admin/layout/DashboardLayout"
import { DashboardPage, Leads } from "../admin/pages"


const appRouter = createBrowserRouter([
    //Dasboard routes
    {
        path: '/dashboard',
        element: <DashboardLayout/>,
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

    {
        path: '*',
        element: <Navigate to='/' />
    },
])

export function AppRouter() {
  return <RouterProvider router={appRouter} />
}
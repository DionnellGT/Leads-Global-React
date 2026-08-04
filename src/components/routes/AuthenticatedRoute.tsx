import { useAuthStore } from "@/leadsglobal/auth/store/useAuthStore"
import { CustomFullScreenLoading } from "@/leadsglobal/components/CustomFullScreenLoading"
import type { PropsWithChildren } from "react"
import { Navigate } from "react-router"


export const AuthenticatedRoute = ({children}: PropsWithChildren) => {

    const { authStatus } = useAuthStore()

    if(authStatus === 'checking') return <CustomFullScreenLoading/>
    if(authStatus === 'not-authenticated') return <Navigate to='/auth/login'/>
  
    return children
}


export const NotAuthenticatedRoute = ({children}: PropsWithChildren) => {

    const { authStatus } = useAuthStore()

    if(authStatus === 'checking') return <CustomFullScreenLoading/>
    if(authStatus === 'authenticated') return <Navigate to='/dashboard'/>
  
    return children
}

export const AdminRoute = ({children}: PropsWithChildren) => {

    const { authStatus, hasAppAccess } = useAuthStore()

    if(authStatus === 'checking') return <CustomFullScreenLoading/>
    // Nota: con el chequeo de rol ya aplicado dentro de login()/checkAuthStatus()
    // en el store, un authStatus 'authenticated' implica hasAppAccess() === true
    // casi siempre; este chequeo queda como defensa adicional, no como camino esperado.
    if(authStatus === 'not-authenticated' || !hasAppAccess()) return <Navigate to='/auth/login'/>
  
    return children
}
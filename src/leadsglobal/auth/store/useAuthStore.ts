import { create } from 'zustand'
import { loginAction } from '../actions/login.action';
import { registerAction } from '../actions/register.action';
import { checkAuthAction } from '../actions/check-auth.action';
import type { User } from '../interface/auth.response';
import { getErrorMessage } from '@/lib/utils';


type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking'

type AuthState = {
  //propiedades
  user: User | null;
  token: string | null;
  authStatus: AuthStatus
  // Motivo real del último login/register fallido (ej: "Credentials are
  // not valid", "email ya está en uso"), para mostrárselo al usuario en
  // vez de un mensaje genérico. Se limpia en cada intento nuevo.
  errorMessage: string | null

  //getters
  isAdmin: () => boolean

  //actions
  login: (email: string, password: string) => Promise<boolean>
  register: (fullName: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuthStatus: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>()((set, get) => ({
    //implementacion del store por defecto
    user: null,
    token: null,
    // Arranca en "checking" (no en "not-authenticated"): si arrancara ya
    // como "not-authenticated", las rutas protegidas redirigirían a
    // /auth/login de entrada, antes de que checkAuthStatus() alcance a
    // validar un token guardado en localStorage. Pasa a 'authenticated'
    // o 'not-authenticated' recién cuando checkAuthStatus() resuelve
    // (se llama una vez al montar la app, ver BrochureApp.tsx).
    authStatus: 'checking',
    errorMessage: null,

    //getters
    isAdmin: () => {
        const roles = get().user?.roles || []
        return roles.includes('admin')
    },
  
    //Acciones
    login: async(email: string, password: string) => {
        set({ errorMessage: null })
        try {
            const data = await loginAction(email, password)
            localStorage.setItem('token', data.token)

            set({
                user: data.user,
                token: data.token,
                authStatus: 'authenticated'
            })
            return true
        } catch (error) {
            localStorage.removeItem('token')
            set({
                user: null,
                token: null,
                authStatus: 'not-authenticated',
                errorMessage: getErrorMessage(error, 'Correo o contraseña incorrectos.'),
            })
            return false
        }
    },
    register: async(fullName: string, email: string, password: string) => {
        set({ errorMessage: null })
        try {
            const data = await registerAction(fullName, email, password)
            localStorage.setItem('token', data.token)

            set({
                user: data.user,
                token: data.token,
                authStatus: 'authenticated'
            })
            return true
            
        } catch (error) {
            localStorage.removeItem('token')
            set({
                user: null,
                token: null,
                authStatus: 'not-authenticated',
                errorMessage: getErrorMessage(error, 'No se pudo crear la cuenta. Intenta de nuevo.'),
            })
            return false
        }
        
    },
    logout: () => {
        localStorage.removeItem('token')
        set({
                user: null,
                token: null,
                authStatus: 'not-authenticated',
                errorMessage: null,
            })
    },
    checkAuthStatus: async() => {
        try {
            const { user, token } = await checkAuthAction()
            set({
                user: user,
                token: token,
                authStatus: 'authenticated'
            })

            return true
        } catch {
            localStorage.removeItem('token')
            set({
                user: null,
                token: null,
                authStatus: 'not-authenticated'
            })
            return false
        }
    }
}))

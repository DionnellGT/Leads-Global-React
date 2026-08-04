import { create } from 'zustand'
import { loginAction } from '../actions/login.action';
import { registerAction } from '../actions/register.action';
import { checkAuthAction } from '../actions/check-auth.action';
import type { User } from '../interface/auth.response';
import { getErrorMessage } from '@/lib/utils';


type AuthStatus = 'authenticated' | 'not-authenticated' | 'checking'

// Esta app (Leads Global) es de uso exclusivo para roles admin y leads.
// Los demás roles (emailMasivo, listaPrecios, user) pertenecen a otras
// apps del mismo ecosistema y no deben poder loguear aquí.
const ALLOWED_ROLES = ['admin', 'leads']

const NOT_ALLOWED_MESSAGE =
  'Tu cuenta no tiene permisos para esta app. Habla con el desarrollador para que te asignen el rol correspondiente (admin o leads).'

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
  // Devuelve true si el usuario tiene rol admin o leads (los únicos
  // habilitados para usar esta app).
  hasAppAccess: () => boolean

  //actions
  login: (email: string, password: string) => Promise<boolean>
  register: (fullName: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  checkAuthStatus: () => Promise<boolean>
  clearMessages: () => void
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
    // (se llama una vez al montar la app, ver LeadsApp.tsx).
    authStatus: 'checking',
    errorMessage: null,

    //getters
    hasAppAccess: () => {
        const roles = get().user?.roles || []
        return roles.some((r) => ALLOWED_ROLES.includes(r))
    },

    //Acciones
    login: async(email: string, password: string) => {
        set({ errorMessage: null })
        try {
            const data = await loginAction(email, password)

            // Solo pueden loguear cuentas con rol admin o leads. Un login
            // con credenciales válidas pero sin esos roles se trata igual
            // que un login fallido: no se persiste sesión.
            if (!data.user.roles.some((r) => ALLOWED_ROLES.includes(r))) {
                set({
                    user: null,
                    token: null,
                    authStatus: 'not-authenticated',
                    errorMessage: NOT_ALLOWED_MESSAGE,
                })
                return false
            }

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

            // El endpoint /auth/register/leads garantiza que el usuario
            // queda con el rol "leads" (o lo agrega si ya existía), así
            // que autologueamos directo, sin pasar por login() de nuevo.
            localStorage.setItem('token', data.token)
            set({
                user: data.user,
                token: data.token,
                authStatus: 'authenticated',
            })
            return true

        } catch (error) {
            set({
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

            // Mismo criterio que login(): una sesión restaurada de una
            // cuenta sin rol admin/leads no debe quedar autenticada.
            if (!user.roles.some((r) => ALLOWED_ROLES.includes(r))) {
                localStorage.removeItem('token')
                set({ user: null, token: null, authStatus: 'not-authenticated' })
                return false
            }

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
    },
    clearMessages: () => set({ errorMessage: null }),
}))

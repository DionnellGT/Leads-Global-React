import { apiClient } from "@/api"
import type { AuthResponse } from "../interface/auth.response"


export const registerAction = async(
    fullName: string,
    email: string, 
    password: string,
): Promise<AuthResponse> => {

    try {
        // Este endpoint es específico de Leads Global: crea la cuenta con
        // rol "leads" (o lo agrega si el email ya existía en GlobalApi,
        // validando la contraseña) y devuelve user + token para
        // autologuear directo, sin pasar por el registro genérico.
        const {data} = await apiClient.post<AuthResponse>('/auth/register/leads',{
            fullName,
            email,
            password,
        })
        return data
    } catch (error) {
        console.log(error)
        throw error
    }
}
import { apiClient } from "@/api"
import type { AuthResponse } from "../interface/auth.response"


export const checkAuthAction = async() => {

    const token = localStorage.getItem('token')
    if(!token) throw new Error('No token found')

    try {
        const { data } = await apiClient.get<AuthResponse>('/auth/check-status')

        localStorage.setItem('token', data.token)

        return data
        
    } catch (error) {
        localStorage.removeItem('token')
        throw new Error('Token is not valid')
        
    }

}
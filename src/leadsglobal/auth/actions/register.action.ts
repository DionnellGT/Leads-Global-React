import { apiClient } from "@/api"
import type { AuthResponse } from "../interface/auth.response"


export const registerAction = async(
    fullName: string,
    email: string, 
    password: string,
): Promise<AuthResponse> => {

    try {
        const {data} = await apiClient.post<AuthResponse>('/auth/register',{
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
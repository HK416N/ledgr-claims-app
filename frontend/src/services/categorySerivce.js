const BASE_URL = import.meta.env.VITE_BACKEND_HOST;

import { getAuthHeaders } from './authService'

export const getCategories = async () => {
    
    const url = `${BASE_URL}/categories`;

    try {
        const response = await fetch (url,{
            headers: getAuthHeaders(),
        });

        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        };

        return await response.json();

    } catch (error) {
        console.error(error.message);
        return {
            success: false,
            error: error.message,
        }
    };
};

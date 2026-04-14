import { getAuthHeaders } from "./authService";

const BASE_URL = import.meta.env.VITE_BACKEND_HOST;

export const getLatestRates = async () => {
    const url = `${BASE_URL}/fx/latest`;

    try {
        const response = await fetch (url, {
            headers: getAuthHeaders(),
        })

        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        };

        return await response.json();

    } catch (error) {
        console.error(error.message);
    };
};

// to dooooooooooo
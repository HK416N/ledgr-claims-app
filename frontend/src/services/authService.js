const BASE_URL = import.meta.env.VITE_BACKEND_HOST;

//get token from localstorage for header
export const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    const headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    };

    return headers;
};

export const signup = async (userData) => {
    const url = `${BASE_URL}/auth/signup`
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData),
        });

        return await response.json();

    } catch (error) {
        console.error(error.message);
    };
};

export const login = async (userData) => {
    const url = `${BASE_URL}/auth/login`
    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(userData),
        });

        return await response.json();
        
    } catch (error) {
        console.error(error.message);
        return {
            success: false,
            error: error.message,
        }
        
    };
};


const BASE_URL = import.meta.env.VITE_BACKEND_HOST;

import { getAuthHeaders } from './authService'

//List
export const getAllClaims = async () => {

    const url = `${BASE_URL}/claims`

    try {
        const response = await fetch(url, {
            headers: getAuthHeaders(),
        });

        if (!response.ok) {
            throw new Error(`Resoponse status: ${response.status}`);
        };

        return await response.json();

    } catch (error) {
        console.error(error.message);
    };
};

//one
export const getClaimById = async (claimId) => {

    const url = `${BASE_URL}/claims/${claimId}`

    try {
        const response = await fetch(url,{
            headers: getAuthHeaders(),
        })

        if (!response.ok) { 
            throw new Error(`Response status: ${response.status}`)
        };

        return await response.json();

    } catch (error) {
        console.error(error.message);
    };
};

//new
export const createClaim = async (claimData) => {
    
    const url = `${BASE_URL}/claims`
    
    try {
        const response = await fetch(url,{
            method: 'POST',
            headers: getAuthHeaders(),
            body: JSON.stringify(claimData),    
        });
        
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        };
        
        return await response.json();

    } catch (error) {
        console.error(error.message);
    }
    
}

//edit
export const updateClaim = async (claimId,updatedData) => {
    
    const url = `${BASE_URL}/claims/${claimId}`
    
    try {
        const response= await fetch(url, {
            method:'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify(updatedData)
    
        });

        if (!response.ok) {
            throw new Error (`Response status: ${response.status}`)
        };
        
        return await response.json();
        
    } catch (error) {
        console.error(error.message);
    };
};

//delete
export const deleteClaim = async (claimId) => {
    
    const url = `${BASE_URL}/claims/${claimId}`;

    try {
        const response = await fetch (url, {
            method:'DELETE',
            headers: getAuthHeaders(),
        });

        if(!response.ok) {
            throw new Error(`Response status: ${response.status}`)
        };
        
        return await response.json()  
    
    } catch (error) {
        console.error(error.message);        
    };

};
const BASE_URL = 'http://localhost:3000/api';

export const API_ENDPOINTS = {
    taxEstimate: {
        create: `${BASE_URL}/tax-estimate/create`,
        getByUser: (userId) => `${BASE_URL}/tax-estimate/user/${userId}`
    }
};
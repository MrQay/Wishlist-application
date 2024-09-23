import axios from 'axios';
import Cookies from 'js-cookie';

const BASE_URL = 'http://localhost:8080/auth';

// Login user
export const login = async (email: any, password: any) => {
    const response = await axios.post(`${BASE_URL}/login`, {
        email,
        password,
    });
    if (response.status === 200) {
        Cookies.set('authToken', response.data.authToken);
    }
    return response;
};

// Register user
export const register = async (email: any, password: any) => {
    const response = await axios.post(`${BASE_URL}/register`, {
        email,
        password,
    });
    return response;
};

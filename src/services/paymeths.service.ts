import axios from 'axios';

const API_URL = 'http://localhost:3000/tips';

export const getPayMethods = () => {
    return axios.get(`${API_URL}/GetAllPayMethods`)
}
import axios from 'axios';

const API_URL = 'http://localhost:3000/tips';

export const postTipProcess = (data: any) => {
    return axios.post(`${API_URL}/CreateTipPayment`, data);
}
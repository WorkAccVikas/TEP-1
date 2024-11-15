import axios from 'axios';

const axiosServices = axios.create({ baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3000/' });

// ==============================|| AXIOS - FOR MOCK SERVICES ||============================== //

export default axiosServices;

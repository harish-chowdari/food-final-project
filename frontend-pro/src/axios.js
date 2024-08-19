import axios from "axios";


const BASE_URL = "http://localhost:3006" 

const axiosInstance=axios.create({
    baseURL:BASE_URL,
});

export default axiosInstance; 
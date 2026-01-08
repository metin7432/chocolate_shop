import axios from 'axios';


const axiosInstance = axios.create({
    baseURL: import.meta.mode === "development" ? "http://localhost:5000/api" : "/api", //backend'en veri cekme
    withCredentials: true // send cookies to the server
});


export default axiosInstance;
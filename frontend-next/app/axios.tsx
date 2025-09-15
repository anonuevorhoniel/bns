import axios from "axios";

const ax = axios.create({
    // baseURL: "http://localhost:8000/api",
    baseURL: "http://192.168.5.39:8000/api",
    // baseURL: "http://192.168.1.23:8000/api",
    // baseURL: "http://10.230.239.231:8000/api",
    withCredentials: true,
});

ax.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export default ax;

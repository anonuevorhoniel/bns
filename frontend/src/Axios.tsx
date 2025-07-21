import axios from "axios"

const ax = axios.create({
    // baseURL: "http://localhost:8000/api",
    baseURL: "http://192.168.1.77:8000/api",
    withCredentials: true,
})

export default ax;
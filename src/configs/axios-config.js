import axios from "axios";

const ipAddress = window.location.hostname;

// axios.defaults.baseURL = `http://${ipAddress}:8889/api/v1`;
axios.defaults.baseURL = `http://${ipAddress}:8889/api/v1`;
// axios.defaults.baseURL = `http://192.168.200.3:8889/api/v1`;
axios.defaults.withCredentials = true;

export default axios;
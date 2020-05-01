const axios = require('axios');

const axios_ts = axios.create({
    baseURL: 'http://localhost:3333/',
});

export default axios_ts;
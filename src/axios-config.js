const axios = require('axios');

const axios_ts = axios.create({
    baseURL: 'https://team-stats-backend.herokuapp.com',
});

export default axios_ts;

// http://localhost:3333
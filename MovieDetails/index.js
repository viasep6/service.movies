const axios = require('axios');

module.exports = function (context, req) {
    let config = {
    method: 'get',
    url: process.env["TMDB_API_URL"] + '/3/movie/' + req.query.movieid,
    headers: { 
        'Authorization': process.env["TMDB_API_TOKEN"]
    }};

    return axios(config)
    .then(function (response)
    {
        context.res = {
            status: response.status,
            body: JSON.stringify(response.data),
            headers: {
                'Content-Type': 'application/json'
            }
        }
    })
    .catch(function (error)
    {
        if (error.response.status === 404) {
            context.res = {
                status: 404,
                body: "MovieID Parameter Error"
               }
        }
        else {
            context.res = {
                status: 500,
                body: error
               }
        }
    });
}
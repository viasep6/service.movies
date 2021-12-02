const axios = require('axios');

module.exports = function (context, req) {
    let config = {
    method: 'get',
    url: process.env["TMDB_API_URL"] + '/3/search/movie?query=' + req.query.query,
    headers: { 
        'Authorization': process.env["TMDB_API_TOKEN"]
    }};

    return axios(config)
    .then(function (response)
    {
        let filteredResponse = response.data.results.map(movie => {
            return {
                "id": movie.id,
                "title": movie.title + " (" + movie.release_date.split("-")[0] + ")"
            }
        });

        context.res = {
            status: response.status,
            body: filteredResponse,
            headers: {
                'Content-Type': 'application/json'
            }
        }
    })
    .catch(function (error)
    {
        context.res = {
            status: 500,
            body: error
           }
    });
}
const axios = require('axios');

module.exports = async function (context, req) {
    let config = {
        method: 'get',
        url: process.env["TMDB_API_URL"] + '/3/movie/now_playing',
        headers: { 
            'Authorization': process.env["TMDB_API_TOKEN"]
        }};
    
        return axios(config)
        .then(function (response)
        {
            let filteredResponse = response.data.results.map(movie => {
    
                if (movie.poster_path !== null || response.data.results.poster_path !== null) {
                    movie.poster_path = process.env["TMDB_API_IMAGE_BASE_URL"] + movie.poster_path;
                    movie.backdrop_path = process.env["TMDB_API_IMAGE_BASE_URL"] + movie.backdrop_path;
                }
        
                return movie
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
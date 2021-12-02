const axios = require('axios');

module.exports = function (context, req) {
    let config = {
    method: 'get',
    url: "https://mowits-movies.azurewebsites.net/movies/moviedetails?movieid=" + req.query.movieid
};

    return axios(config)
    .then(function (response)
    {
        let baseUrl = process.env["TMDB_API_IMAGE_BASE_URL"]
        console.log(response.data.poster_path);
        let posterPath = response.data.poster_path;

        let posterUrl = baseUrl + posterPath;

        console.log(posterUrl);
        context.res = {
            status: response.status,
            body: posterUrl
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
            console.log(error);
            context.res = {
                status: 500,
                body: error
               }
        }
    });
}
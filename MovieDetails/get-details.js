const axios = require('axios');

getMovieDetails = (request, response) => {
    let config = {
        method: 'get',
        url: `${process.env["TMDB_API_URL"]}/3/movie/${request.query.movieid}`,
        headers: { 
            'Authorization': process.env["TMDB_API_TOKEN"]
        }};
    
        return axios(config)
        .then(function (response)
        {
            return response.data;
        })
        .catch(function (error)
        {
            if (error.response.status === 404) {
                response.res = {
                    status: 404,
                    body: "MovieID Parameter Error"
                   }
            }
            else {
                response.res = {
                    status: 500,
                    body: error
                   }
            }
        });
}

getMovieCast = (request, response) => {
    let config = {
        method: 'get',
        url: `${process.env["TMDB_API_URL"]}/3/movie/${request.query.movieid}/credits`,
        headers: { 
            'Authorization': process.env["TMDB_API_TOKEN"]
        }};
    
        return axios(config)
        .then(function (response)
        {
            return response.data;
            
        })
        .catch(function (error)
        {
            if (error.response.status === 404) {
                response.res = {
                    status: 404,
                    body: "MovieID Parameter Error"
                   }
            }
            else {
                response.res = {
                    status: 500,
                    body: error
                   }
            }
        });
}

exports.getMovieDetailsWithCast = (request, response) => {

    Promise.all([getMovieDetails(request, response), getMovieCast(request, response)])
        .then(function (results) {
            let movieDetails = results[0];
            
            movieDetails.poster_path = process.env["TMDB_API_IMAGE_BASE_URL"] + movieDetails.poster_path;
            movieDetails.backdrop_path = process.env["TMDB_API_IMAGE_BASE_URL"] + movieDetails.backdrop_path;
            movieDetails.production_companies.map(company => company.logo_path = process.env["TMDB_API_IMAGE_BASE_URL"] + company.logo_path);
            
            let genreArray = []
            movieDetails.genres.map(genres => genreArray.push(genres.name))
            movieDetails.genres = genreArray.join(", ");

            let languageArray = []
            movieDetails.spoken_languages.map(languages => languageArray.push(languages.name))
            movieDetails.spoken_languages = languageArray.join(", ");
            
            let movieCast = results[1].cast;
            let filteredCrew = movieCast.map(crew => {
                return {
                    "id": crew.id,
                    "name": crew.name,
                    "character": crew.character,
                    "picture_path": process.env["TMDB_API_IMAGE_BASE_URL"] + crew.profile_path
                }
            });

            let detailsWithCast = {
                ...movieDetails,
                crew: [...filteredCrew]
            }
            
            return response.res.json(detailsWithCast);

        }).catch(function (error) {
            console.error(error);
            return response.res.status(500).json(error.code);
        });
}
const axios = require('axios');
const { db, admin } = require('../service.shared/Repository/Firebase/admin')

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

getLocalMovieDetails = async (request, response) => {
    const movieId = request.query.movieid;
    let res = {}

    const movieRef = db.doc('movies/' + movieId);
    const movieDoc = await movieRef.get()
    if (movieDoc.exists) {
        const movieData = movieDoc.data()
        if (request.query.userId) {
            const userId = request.query.userId;
            const followers = movieData.followers?.map(x => x.id)
            // check if user is subscribed to movie
            res.isSubscribed = followers.includes(userId)            

        }
        res = {...res, ...movieData};
        delete res.followers;
        delete res.title
    }

    return res
}

exports.getMovieDetailsWithCast = (request, response) => {
    
    Promise.all([getMovieDetails(request, response), getMovieCast(request, response), getLocalMovieDetails(request, response)])
        .then(function (results) {
            let movieDetails = results[0];
            
            if (movieDetails.poster_path !== null || movieDetails.poster_path !== null) {
                movieDetails.poster_path = process.env["TMDB_API_IMAGE_BASE_URL"] + movieDetails.poster_path;
                movieDetails.backdrop_path = process.env["TMDB_API_IMAGE_BASE_URL"] + movieDetails.backdrop_path;
            }
            movieDetails.production_companies.map(company => company.logo_path = process.env["TMDB_API_IMAGE_BASE_URL"] + company.logo_path);
            
            let genreArray = []
            movieDetails.genres.map(genres => genreArray.push(genres.name))
            movieDetails.genres = genreArray.join(", ");

            let languageArray = []
            movieDetails.spoken_languages.map(languages => languageArray.push(languages.name))
            movieDetails.spoken_languages = languageArray.join(", ");
            
            let movieCast = results[1].cast;
            let filteredCast = movieCast.map(cast => {
                let profile_picture_path = (cast.profile_path !== null ? process.env["TMDB_API_IMAGE_BASE_URL"] + cast.profile_path : null)

                return {
                    "id": cast.id,
                    "name": cast.name,
                    "character": cast.character,
                    "picture_path": profile_picture_path
                }
            });

            let movieCrew = results[1].crew;
            let directors = movieCrew.filter(crew => crew.job === "Director").map(crew => {
                let profile_picture_path = (crew.profile_path !== null ? process.env["TMDB_API_IMAGE_BASE_URL"] + crew.profile_path : null)

                return {
                    "id": crew.id,
                    "name": crew.name,
                    "job": crew.job,
                    "picture_path": profile_picture_path
                }
            });


            let detailsWithCast = {
                ...movieDetails,
                cast: [...filteredCast],
                crew: [...directors],
                mowits: results[2],
            }
            
            return response.res.json(detailsWithCast);

        }).catch(function (error) {
            console.error(error);
            return response.res.status(500).json(error.code);
        });
}
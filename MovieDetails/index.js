const details = require('./get-details')

module.exports = function (context, req) {
    details.getMovieDetailsWithCast(req, context)
}
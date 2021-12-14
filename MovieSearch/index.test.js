const axios = require('axios');
const MockAdapter = require('axios-mock-adapter');
const index = require('./index');

describe('Now playing', () => {

    let OLD_ENV = {};
    beforeEach(() => {
        OLD_ENV = process.env;
        process.env['TMDB_API_URL'] = 'http://TMDB_API_URL';
        process.env['TMDB_API_IMAGE_BASE_URL'] = 'http://TMDB_API_IMAGE_BASE_URL';
        process.env['TMDB_API_TOKEN'] = 'Some token';
    });

    afterEach(() => {
        process.env = OLD_ENV;
    });

    describe('when API call is successful', () => {

        it('can respond', async () => {
            // arrange
            let context = {res: {}};
            let req = {query:{query: "test_query"}};
            let responseData = {
                results: [
                    {
                        title: "test_movie_title",
                        poster_path: 'test_poster_path',
                        backdrop_path: 'test_backdrop_path',
                        id: 'test_movie_id',
                        release_date: "test_release_date"
                    },
                ],
            };
            let mock = new MockAdapter(axios);
            mock.onGet().reply(200, responseData);

            const index = require('./index');
            // act
            await index(context, req);

            // assert
            const usedUrl = mock.history.get[0].url
            expect(usedUrl).toBe("http://TMDB_API_URL/3/search/movie?query=" + `${req.query.query}`)
            expect(context.res.status).toBe(200);
            expect(context.res.body.length).toBe(1);
            expect(context.res.body[0].id).toBe(responseData.results[0].id);
            expect(context.res.body[0].title).toBe(responseData.results[0].title);
            expect(context.res.body[0].release_date).toBe(responseData.results[0].release_date);
        });
    });

});
const httpFunction = require('./get-details');
const context = require('../testing/defaultContext')

jest.mock('firebase-admin', () => ({
    ...jest.mock('firebase-admin'),
    credential: {
      cert: jest.fn(),
    },
    initializeApp: jest.fn(),
    firestore: jest.fn(),
    apps: ["testAppID"]
  }));

test('Http trigger should return known text', async () => {

    const request = {
        query: { name: 'Bill' }
    };

    await httpFunction.getMovieDetailsWithCast(request, context);

    expect(context.log.mock.calls.length).toBe(1);
    expect(context.res.body).toEqual('Hello Bill');
});
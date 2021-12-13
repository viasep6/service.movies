const httpFunction = require('./index');
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

test('Valid Movie ID should return 200 status', async () => {

    const request = {
        query: { movieid: 2179 }
    };

    await httpFunction(context, request);

    expect(context.res.status).toEqual(200);
});
const request = require('supertest');
const { User } = require('../../models/users');
const { Genre } = require('../../models/genres');
let server;


describe('auth middleware', () => {
    let token;

    beforeEach(() => { 
        server = require('../../index');
        token = new User().generateAuthToken();
    });
    afterEach(async () => { 
        server.close();
        await Genre.remove({});
    });

    const execPath = () => {
        return request(server)
            .post('/genres')
            .set('x-auth-token', token)
            .send( {name: 'genre1'} );
    };

    it('should return 401 if no token is provided', async () => {
        token = ''
        const res = await execPath();
        expect(res.status).toBe(401);
    });

    it('should return 400 if invalid token is provided', async () => {
        token = 'a'
        const res = await execPath();
        expect(res.status).toBe(400);
    });

    it('should return 400 if invalid token is provided', async () => {
        const res = await execPath();
        expect(res.status).toBe(200);
    });
});
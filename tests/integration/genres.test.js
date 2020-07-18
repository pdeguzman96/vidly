const request = require('supertest');
const { Genre } = require('../../models/genres');
const { User } = require('../../models/users');
let server;

// Overall test suites
describe('/api/genres', () => {
    beforeEach(() => {
        // Jest calls thsi before each test in this suite
        server = require('../../index');
    });
    afterEach(async () => {
        // Jest calls this after each test in this suite
        // Removes all genres
        server.close();
        await Genre.remove({});
    });

    describe('GET /', () => {
        it('should return all genres', async () => {
            // Inserting Genres
            Genre.collection.insertMany([
                { name: 'genre1' },
                { name: 'genre2' }
            ]);

            const res = await request(server).get('/genres');
            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(g => g.name === 'genre1')).toBeTruthy();
            expect(res.body.some(g => g.name === 'genre2')).toBeTruthy();
        });
    });

    describe('GET /:id', () => {
        it('should return a particular Genre by the given ID', async () => {
            const newGenre = Genre({ name: 'genre1' });
            await newGenre.save();

            const res = await request(server).get(`/genres/${newGenre._id}`);
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('genre1');
        });

        it('should return a 404 if the given ID does not exist', async () => {
            const res = await request(server).get(`/genres/1`);
            expect(res.status).toBe(404);
        });
    });

    describe('POST /', () => {

        let token;
        let name;

        /**
         * Utiltiy template function for sending POST requests
         */
        const execPath = async () => {
            return await request(server)
            .post('/genres')
            .set('x-auth-token', token)
            .send({ name })
        };

        /**
         * Automatically set parameters for the happy path before each test
         */
        beforeEach(() => {
            // Log in - generate auth token and include in req header
            token = new User().generateAuthToken();
            name = 'genre1';
        })

        it('should return a 401 if client is not logged in', async () => {
            // Unset token
            token = ''
            const res = await execPath()
            expect(res.status).toBe(401);
        });

        it('should return a 400 if the given genre is less than 2 chars', async () => {
            name = '1'
            const res = await execPath();
            expect(res.status).toBe(400);
        });

        it('should return a 400 if the given genre is more than 20 chars', async () => {
            name = new Array(22).join('a')
            const res = await execPath();
            expect(res.status).toBe(400);
        });

        it('should save the genre if the given genre is valid', async () => {
            const res = await execPath();
            const genre = await Genre.find({ name: 'genre1' });
            expect(genre).not.toBeNull();
        });

        it('should return the genre if the given genre is valid', async () => {
            const res = await execPath();
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name', 'genre1');
        });
    });
});
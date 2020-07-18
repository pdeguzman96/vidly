const request = require('supertest');
const { Genre } = require('../../models/genres');
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
            const savedGenre = await newGenre.save();

            const res = await request(server).get(`/genres/${savedGenre._id}`);
            expect(res.status).toBe(200);
            expect(res.body.name).toBe('genre1');
        });

        it('should return a 404 if the given ID does not exist', async () => {
            const res = await request(server).get(`/genres/5ef572fd32320b8188d2cb23`);
            expect(res.status).toBe(404);
        });
    });
});
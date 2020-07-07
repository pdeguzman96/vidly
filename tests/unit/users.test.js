const { User } = require('../../models/users');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.generateAuthToken', () => {
    it('should generate a valid JWT for a given user', () => {
        const fakeId = mongoose.Types.ObjectId()
        const fakeUser = new User({
            _id: fakeId,
            name: 'john',
            email: 'john.doe@email.com',
            isAdmin: true
        });

        const authToken = fakeUser.generateAuthToken();
        const decodedPayload = jwt.verify(authToken, config.get('jwtPrivateKey'));

        expect(decodedPayload._id).toBe(fakeId.toString());
        expect(decodedPayload.isAdmin).toBe(true);
    })
})
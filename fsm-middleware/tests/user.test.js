const  expect       = require('expect');
const  request      = require('supertest');
const   app         = require('../app');
const   User        = require('../database/mongo/models/user');
const mongoose      = require('../database/mongo/mongoose');
const Mockgoose     = require('mockgoose').Mockgoose;
const mockgoose     = new Mockgoose(mongoose); //mockgoose intercepts that connection

let Cookies;

before(function(done) {
    mockgoose.prepareStorage().then(function() {
        //basically simulates your current database, so you can continue using the methods save, find, etc from mongoose.
        mongoose.connect('mongodb://suhas:suhas@ds119772.mlab.com:19772/freelancerdb', function(err) {
            done(err);
        });
    });
});

after(function (done) {
    mockgoose.helper.reset().then(() => {
        done();
    });
});

describe('POST: /users/register', () => {

    it('should create a new user', (done) => {

        let validUser = {
            username: 'Test Iron Man',
            email   : 'test.iron@stark.com',
            password: '123123'
        };

        request(app)
            .post('/users/register')
            .send( validUser )
            .expect(200)
            .expect((res) => {
                expect(res.body.message).toBe('User registered successfully.');
            })
            .end((err, res) => {
               if(err) {
                   return done(err);
               }

               User.find().then((users) => {
                   expect(users.length).toBe(1);
                   expect(users[0].username).toBe(validUser.username);
                   done();
               }).catch((e) => done(e));
            });
    });

});

describe('POST: /users/login', () => {

    it('should login valid user', (done) => {

        let testValidUser = {
            username: 'Test Iron Man',
            password: '123123'
        };

        request(app)
            .post('/users/login')
            .send(testValidUser)
            .expect(200)
            .expect((res) => {
                // save cookie for future use
                Cookies = res.headers['set-cookie'].pop().split(';')[0];
                console.log(Cookies);
                expect(res.body.message).toBe('Login Successful');
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });

    });

    it('should reject invalid user from logging in', (done) => {

        let testInvalidLogin = {
            username: 'Test Iron Man1',
            password: '123123'
        };

        request(app)
            .post('/users/login')
            .send(testInvalidLogin)
            .expect(404)
            .expect((res) => {
                expect(res.body.message).toBe("The username doesn't have an account. Please create an account. ");
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });

    it('should reject invalid password logging in', (done) => {

        let testInvalidPassword = {
            username: 'Test Iron Man',
            password: '123123123'
        };

        request(app)
            .post('/users/login')
            .send(testInvalidPassword)
            .expect(401)
            .expect((res) => {
                expect(res.body.message).toBe("The username and password you entered did not match our records. Please double-check and try again.");
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                done();
            });
    });
});

describe('POST: /users/logout', () => {

    it('should logout user', (done) => {

        let req = request(app).post('/users/logout');
        // Set cookie to get saved user session
        req.cookies = Cookies;

        req.expect(200)
            .end(function (err, res) {
                if (err) {
                    return done(err);
                }
                expect(res.body.message).toBe('Logout successful.');
                done();
            });
    });

});
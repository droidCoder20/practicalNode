var should = require('should'),
    request = require('supertest'),
    app = ('../app.js'),
    mongoose = require('mongoose'),
    Book = require('../models/bookModel'),
    agent = request.agent(app);

describe('Book Crud Test', function(){
    it('should allow a book to be posted and return a read and _id',function(done){
        var bookPost = {
            title: 'new Book',
            author: 'orlando',
            genre: 'Fiction'
        };

        agent.post('/api/books')
            .send(bookPost)
            .expect(200)
            .end(function(err, results){
                console.log(err);
                results.body.read.should.equal(false);
                results.body.should.have.property('_id');
                done();
            });
    });

    afterEach(function(done){
        Book.remove().exec();
        done();
    });
});

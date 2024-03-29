var express = require('express');

var routes = function(Book){
    var bookRouter = express.Router(),
        bookController = require('../Controllers/bookController')(Book);

    bookRouter.route('/')
        .post(bookController.post)
        .get(bookController.get);

    bookRouter.use('/:bookId', function(req, res, next){
        Book.findById(req.params.bookId, function(err, book) {
            if(err) {
                res.status(500).send(err);
            }
            else if(book) {
                req.book = book;
                next();
            }
            else {
                res.status(404).send('no book found');
            }
        });
    });
    bookRouter.route('/:bookId')
        .get(function(req, res){
            res.json(req.book);
        })
        .put(function(req,res){
            book.title = req.body.title;
            book.author = req.body.author;
            book.genre = req.body.genre;
            book.read = req.body.read;
            req.book.save(function(err){
                if(err) {
                    res.status(500).send(err);
                }
                else {
                    res.status(200).json(req.book);
                }
            });
        })
        .patch(function(req,res){
            if(req.body._id)
                delete req.body._id;

            for(var key in req.body) {
                req.book[key] = req.body[key];
            }

            req.book.save(function(err){
                if(err) {
                    res.status(500).send(err);
                }
                else {
                    res.status(200).json(req.book);
                }
            });
        })
        .delete(function(req,res){
            req.book.remove(function(err){
                if(err)
                    res.status(500).send(err);
                else {
                    res.status(204).send('Removed');
                }
            });
        });
    return bookRouter;
};

module.exports = routes;

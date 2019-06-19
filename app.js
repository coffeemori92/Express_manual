var express = require('express');
var birds = require('./birds');
var app = express();

app.use(express.static('./public'));

var myLogger = function(req, res, next){
    console.log('LOGGED');
    next();
};

var requestTime = function(req, res, next){
    req.requestTime = Date.now();
    next();
};

app.use(myLogger);

app.use(requestTime);

app.use('/birds', birds);

app.get('/', (req, res) => {
    let responseText = 'Hello World!<br>';
    responseText += 'Requeset at : ' + req.requestTime + '';
    res.send(responseText);
});

app.post('/', (req, res) => {
    res.send('Got a POST requset!');
});

app.put('/user', (req, res) => {
    res.send('Got a PUT request at /user');
});

app.delete('/user', (req, res) => {
    res.send('Got a DELETE request at /user');
});

app.get('/example/a', (req, res) => {
    res.send('Hello from A!');
});

app.get('/example/b', (req, res, next) => {
    console.log('the response will be sent by the next function');
    next();
}, (req, res) => {
    res.send('Hello from B!');
});

let cb0 = (req, res, next) => {
    console.log('CB0');
    next();
}

let cb1 = (req, res, next) => {
    console.log('CB1');
    next();
}

let cb2 = (req, res, next) => {
    res.send('Hello from C!');
}

app.get('/example/c', [cb0, cb1, cb2]);

app.route('/book')
    .get((req, res)  => res.send('Get a random book!'))
    .post((req, res) => res.send('Add a book!'))
    .put((req, res)  => res.send('Update the book!'));

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something broke!');
});

app.use((req, res, next) => {
    res.status(404).send('Sorry cannot find that!');
});

app.listen(3000, () => {
    console.log('listening on port 3000!');
});
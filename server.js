const express = require('express');
const mongoose = require('mongoose');

// Connect Controller routes
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const posts = require('./routes/api/posts');

app = express();

// DB config
const db = require('./config/keys').mongoURL;

// Connect to mongodb
mongoose
    .connect(db)
    .then(()=>{
        console.log('MogoDb connected')
    })
    .catch(err => console.log(err));

app.get('/', (req, res)=>{
    res.send('Hello!!');
});

// Use Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = process.env.port || 5000;
app.listen(port, ()=>{
    console.log(`The server is RUNNNING on PORT ${port}`);
});
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

mongoose
    .set('useCreateIndex', true)
    .connect(MONGODB_URI, {
            useUnifiedTopology: true,
            useNewUrlParser: true,
            useFindAndModify: false
        })
    .then(() => console.log('BD conectada!'))
    .catch(err => {
            console.log(err);
        });
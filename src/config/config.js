const mongoose = require('mongoose')

mongoose
.connect('mongodb://127.0.0.1:27017/banktransaction', {
    useNewUrlParser: true,
    useCreateIndex: true,
    // useFindAndModify: true,
    useUnifiedTopology: true
})
.then(() => console.log( '> Database Connected' ))
.catch(err => console.log( err ));
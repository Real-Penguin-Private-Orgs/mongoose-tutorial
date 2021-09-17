const express = require('express');
const connect = require('./db');
const yup = require('yup')
const morgan = require('morgan');
const IceCream = require('./models/IceCream');
const app = express()

var port = process.env.PORT || 5000;

//CONNECT TO MONGODB DATABASE
connect()
.then(() => {
     console.log(`Connected to database`);
}).catch((err) => {
    console.log(err);
})

//VALIDATE THE REQUEST BODY
const schema = yup.object().shape({
    flavour: yup.string().trim().required(),
    brand: yup.string().trim().required(),
})

app.use(morgan('tiny'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
    res.json({
        message: 'Hello World 😋'
    })
})

//GET ALL
app.get('/icecream', async(req, res, next) => {
    await IceCream.find().exec((err, docs) => {
        if(err) return next(err)
        res.json(docs)
    })
})

//POST ONE
app.post('/icecream', async(req, res, next) => {
    let { flavour, brand } = req.body;
    if(!flavour || !brand) {
        return schema.validate({
            flavour,
            brand
        }).catch((err) => {
            next(err)
        })
    }

    await IceCream.create({flavour, brand})
    .then((docs) => {
        res.json(docs)
    })
    .catch((err) => {
        next(err)
    })
})

// GET ONE
app.get('/icecream/:id', async(req, res, next) => {
    let { id } = req.params;
    if(!id) return next()

    await IceCream.findById({ _id: id })
    .exec((err, docs) => {
        if(err) return next(err);
        res.json(docs);
    })
})

//DELETE ONE 
app.get('/icecream/:id', async(req, res, next) => {
    let { id } = req.params;
    if(!id) return next()

    await IceCream.deleteOne({ _id: id}).exec((err) => {
        if(err) return next(err)
        res.json({
            message: 'Deleted'
        })
    })
})

app.listen(port, () => {
    console.log(`App listening to http://localhost:${port}`);
})
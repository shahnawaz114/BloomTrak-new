var express = require('express');
const cors = require('cors');
var bodyParser = require('body-parser');
const http = require('http');

const port = process.env.PORT || 3011

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());

// const corsOptions = {
//     origin: '*'
// }
// app.use(cors(corsOptions));
const whitelist = ['capacitor://localhost', 'http://localhost', 'http://localhost:4200', 'http://localhost:2100', 'http://18.169.95.14:3011', 'http://18.169.95.14']
const corsOptions = {
    origin: function (origin, callback) {
        //console.log('..................>>>>>>>>>>>>>', origin)
        if (whitelist.indexOf(origin) !== -1) {
            callback(null, true)
        } else {
            // callback(new Error('Not allowed by CORS'))
            callback(JSON.stringify({ data: [], error: true }), true)

        }
    }
}
// app.use(function (req, res, next) {
//     // res.header("Access-Control-Allow-Origin", "*");
//     // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,authorization,Authorization");
//     res.header("Access-Control-Allow-Origin", "*");
//     res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
//     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept,Authorization,authorization");

//     // console.log(req);

//     next();
// });
// ///app.use(require('./app/jwtMiddleware'));//JWT Authentication.Token expire after 24hr
// //var assetlinks = fs.readFileSync(__dirname + '/utils/assetlinks.json');
// app.get('/.well-known/assetlinks.json', function (req, res, next) {
//     res.set('Content-Type', 'application/json');
//     console.log("req", req);
//     res.status(200).send(assetlinks);
// });

const routes = require('./app/routes/appRoutes')
app.use(cors(corsOptions));

app.get('/', (req, res) => {
    res.send('Hello bloom_trak');

})
app.use('/', routes);
app.listen(port, () => {
    console.log(`server is listening on ${port}`);
})
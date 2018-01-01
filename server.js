const express = require('express')
const compression = require('compression')
const next = require('next')
const admin = require('firebase-admin')
const session = require('express-session')
const LokiStore = require('connect-loki')(session)
const bodyParser = require('body-parser')
const uuid = require('uuid')


const { SERVER_CONFIG } = process.env
const port = parseInt(process.env.PORT, 10) || 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const cert = SERVER_CONFIG ?
    JSON.parse(Buffer.from(SERVER_CONFIG, 'base64').toString()) :
    require('./config/server')

admin.initializeApp({
    credential: admin.credential.cert(cert),
    databaseURL: 'https://nextagram-88e06.firebaseio.com'
})

app.prepare()
    .then(() => {
        const server = express()
        const secret = uuid.v4()
        //middleware 
        server.use(compression())
        server.use(bodyParser.json())
        server.use(session({
            secret: secret,
            store: new LokiStore({ path: './session-store.db' }),
            resave: false,
            saveUninitialized: false,
            cookie: { maxAge: 604800000 } // week
        }))
        server.use((req, res, next) => {
            req.firebaseServer = admin
            next()
        })
        //routes
        server.post('/api/login', (req, res) => {
            if (!req.body) return res.sendStatus(400)
            admin.auth().verifyIdToken(req.body.token)
                .then(decodedToken => {
                    const { uid, picture, name } = decodedToken
                    req.session.decodedToken = decodedToken
                    admin.database().ref(`users/${uid}/info`).update({ picture, name })
                    return res.json({ status: true })
                })
                .catch(error => res.json({ error }))
        })
        server.post('/api/logout', (req, res) => {
            req.session.destroy()
            res.json({ status: true })

        })
        server.get('/', (req, res) => {
            if (req.session.decodedToken) {
                res.redirect('/profile')
            }
            else {
                handle(req, res)
            }

        })
        server.get('*', (req, res) => handle(req, res))

        server.listen(port, (err) => {
            if (err) throw err
            console.log(`> Ready on http://localhost:${port}`)
        })
    })
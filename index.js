import express from 'express';
import session from 'express-session';
import passport from 'passport';
// import cookieSession from 'cookie-session';
import mongoose  from 'mongoose';
import { DOMAIN,PORT,DBCONN } from './constant.js';
import auth from './auth.js'; //tidak perlu importhanya loaded jadi seperti baris dibawah
// require('./auth'); // agar loaded passport google startegy;


const app = express();

app.use(session({ secret : 'cats', resave : true, saveUninitialized : true }));
app.use(passport.initialize());
app.use(passport.session());

const isLoggedIn = (req, res, next) => {
    return req.user ? next() : res.sendStatus(401);
    // return req.user ? next() : res.status(401).json({
    //     message : "UnAuthorized"
    // })
}

app.get('/', (req, res) => {
    res.send('<a href="/auth/google">Authenticate Google</a>');
});

app.get('/auth/google', 
        passport.authenticate('google',{ scope : ['profile','email']}) // invoke authenticate function at paspport lib to authenticate google (yg ada di auth.js)
);

// app.get('/auth/google/redirect', passport.authenticate('google'), (req, res) => {
//     res.send(`Welcome ${req.user.username} ${req.user.email}`);
//     // res.redirect('/auth/profile/');
// });

app.get('/auth/google/redirect', 
        passport.authenticate('google',{
            successRedirect : '/protected',
            failureRedirect : '/auth/failure',
        })
);

app.get('/auth/profile', (req, res) => {
    // console.log('-----------------');
    // console.log(req);
    res.send('profile');
})

app.get('/protected', isLoggedIn, (req, res) => {
    // console.log(req);
    res.send(`Welcome to ${req.user.username} profile`);
});

app.get('/auth/failure', (req, res) => {
    res.send('login failure');
});

app.get('/logout', (req, res) => {
    req.logOut();
    res.send('U r LogOut');
});

const mongooseOptions ={
    useNewUrlParser : true,
    useUnifiedTopology : true
}

const listen = () => {
    return app.listen(PORT, () => console.log(`Passport App Running on ${DOMAIN}`));
}

const main = async () => {
    try {
        await mongoose.connect(DBCONN,mongooseOptions)
        .then(listen())
        .catch((err) => console.log(`Error DB Connection ${err}`));
    } catch (error) {
        console.log(`Error running App - \n ${error}`)
    }
}

main();
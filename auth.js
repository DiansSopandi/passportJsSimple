import passport from 'passport';
import { Strategy } from 'passport-google-oauth20';
import { DOMAIN, CLIENTID,CLIENTSECRET } from './constant.js';
import User  from './userModel.js';

passport.serializeUser(( user, done) =>{    
    // console.log('id table mongodb _id');
    done(null,user.id); // id table mongodb (_ids)
});

passport.deserializeUser(( id, done) =>{    
    // console.log(`ID ${id}`);
    User.findById(id)
    .then((user) => { 
        done(null,user);
    })
    .catch((error) => console.log(` Error Find By ID ${error.emails}`));
});

passport.use(
    new Strategy({
        clientID : CLIENTID,
        clientSecret : CLIENTSECRET,
        callbackURL : `${DOMAIN}/auth/google/redirect`
    },
    (accessToken,refreshToken,profile,done) =>{
        User.findOne({googleId : profile?.id})
        .then((currUser) => {
            if (currUser) {
                // console.log(`User ${currUser.userName} \n ${currUser.email} already exist`);
                console.log(` Current User : ${currUser}`);
                done(null,currUser);
            } else {
                let user = new User({
                    googleId : profile.id,
                    email : profile.emails[0].value,
                    username : profile.displayName,
                });

                user.save()
                .then( (newUser) => {
                    console.log(`user ${newUser} created`)
                    done(null,newUser);
                })
                .catch( (error) => console.log(`save fail ${error.message}`));
            }
        })
        .catch((error) => console.log(` Error Query ${error.message}`));                        
    })
);

export default passport;
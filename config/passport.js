const passport=require("passport");
const GoogleStrategy=require("passport-google-oauth20").Strategy;
const mongoose=require("mongoose");
const User=mongoose.model("users");

passport.use(
    new GoogleStrategy({
        clientID: "your Client ID",
        clientSecret: "Your Client Secret",
        callbackURL: "/auth/google/callback",
    }, async (accessToken, refreshToken, profile, done) => {
        const newUser={
            googleId:profile.id,
            firstName:profile.name.givenName,
            lastName:profile.name.familyName,
            displayName:profile.displayName,
            email:profile.emails[0].value,
            image:profile.photos[0].value,
        };


        
       // console.log("new user",newUser);
       try {
        let user=await User.findOne({email:newUser.email});
        if(user){
            //user exists
            console.log("Existing user",user);
            done(null,user);
        }
        else{
            //this is like signup for the first time
            user=await User.create(newUser);
            console.log("new user",user);
            done(null,user);
        }
        
    } catch (error) {
        console.log(error);
        done(error);
    }




    })
);
passport.serializeUser((user,done)=>{
    done(null,user.id);
});

passport.deserializeUser(async(userId,done)=>{
    try {
       const user=await User.findById(userId);
       done(null,user);
    } catch (error) {
       console.log("Error in deserialize function:",error);
       done(error);
    }
});
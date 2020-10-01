var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    passport    = require("passport"),
    cookieParser = require("cookie-parser"),
    LocalStrategy = require("passport-local"),
    flash        = require("connect-flash"),
    Campground  = require("./models/campground"),
    Comment     = require("./models/comment"),
    User        = require("./models/user"),
    session = require("express-session"),
    seedDB      = require("./seeds"),
    methodOverride = require("method-override");

// configure dotenv
require('dotenv').load();

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index")
    
// assign mongoose promise library and connect to database
mongoose.Promise = global.Promise;


// const databaseUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/yelp_meme/v3';

// mongoose.connect('mongodb://localhost:27017/yelp_meme', {no
//   useNewUrlParser: true,
//   useUnifiedTopology: true
// })
// .then(() => console.log('Connected to DB!'))
// .catch(error => console.log(error.message));

// mongoose.connect("mongodb+srv://sarasegel:NY%253z%26EN%402k%23S5T1@yelpcamp.owjlv.mongodb.net/test?retryWrites=true"); 

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://sarasegel:NY%253z%26EN%402k%23S5T1@yelpcamp.owjlv.mongodb.net/yelpcamp?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  // perform actions on the collection object
	console.log("MongoDB connected!");
  client.close();
});

// var databaseUri = 'mongodb://localhost:27017/yelp_meme/v3';
// mongoose.connect(databaseUri, { useMongoClient: true })
//       .then(() => console.log(`Database connected at ${databaseUri}`))
//       .catch(err => console.log(`Database connection error: ${err.message}`));


app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride('_method'));
app.use(cookieParser('secret'));
// require moment
app.locals.moment = require('moment');
// seedDB(); //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Once again Rusty wins cutest dog!",
    resave: false,
    saveUninitialized: false
}));

app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
   res.locals.currentUser = req.user;
   res.locals.success = req.flash('success');
   res.locals.error = req.flash('error');
   next();
});

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);

app.listen(process.env.PORT || 3000, process.env.IP, function() {
	console.log('The YelpCamp Server Has Started!');
});
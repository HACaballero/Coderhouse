const MongoStore = require("connect-mongo");
var expresSession = require("express-session");
const mongoUrl =
	"mongodb+srv://ACaballero:afotNbT5cDOvGazW@cluster0.rkbgt.mongodb.net/sesiones?retryWrites=true&w=majority";
const mongoOptions = { useNewUrlParser: true, useUnifiedTopology: true };
const expirationTime = 600000;
const secret = "secretDB";

const session = expresSession({
	store: MongoStore.create({
		mongoUrl,
		mongoOptions,
	}),
	secret: secret,
	resave: true,
	saveUninitialized: false,

	cookie: {
		expires: expirationTime,
	},
});

module.exports = {session};

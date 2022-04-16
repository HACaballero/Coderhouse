const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let userSchema = new Schema({
	id: {
		type: String,
	},
	email: {
		type: String,
	},
	password: {
		type: String,
	},
	salt: {
		type: String,
	},
});

const User = mongoose.model("User", userSchema);

module.exports = {
	User,
};

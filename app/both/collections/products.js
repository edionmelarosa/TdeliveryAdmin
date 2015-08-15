/*this.Users = new Mongo.Collection("users");*/

this.Users.userCanInsert = function(userId, doc) {
	return true;
}

this.Users.userCanUpdate = function(userId, doc) {
	return true;
}

this.Users.userCanRemove = function(userId, doc) {
	return true;
}

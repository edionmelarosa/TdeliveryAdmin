Meteor.publish("users", function() {
	return Users.find({}, {});
});

Meteor.publish("users_empty", function() {
	return Users.find({_id:null}, {});
});

Meteor.publish("customer", function(customerId) {
	return Users.find({_id:customerId}, {});
});


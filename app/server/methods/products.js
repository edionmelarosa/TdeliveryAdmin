Meteor.methods({
	addProducts: function(params){
		if(!Users.isAdmin(Meteor.userId())) {
			throw new Meteor.Error(403, "Access denied.");
		}
		Products.insert(params);
	}
});
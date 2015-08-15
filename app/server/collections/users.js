Users.allow({
	insert: function (userId, doc) {
		return Users.userCanInsert(userId, doc);
	},

	update: function (userId, doc, fields, modifier) {
		return Users.userCanUpdate(userId, doc);
	},

	remove: function (userId, doc) {
		return Users.userCanRemove(userId, doc);
	}
});

Users.before.insert(function(userId, doc) {
	doc.createdAt = new Date();
	doc.createdBy = userId;
	doc.modifiedAt = doc.createdAt;
	doc.modifiedBy = doc.createdBy;

	
	if(!doc.createdBy) doc.createdBy = userId;
});

Users.before.update(function(userId, doc, fieldNames, modifier, options) {
	modifier.$set = modifier.$set || {};
	modifier.$set.modifiedAt = new Date();
	modifier.$set.modifiedBy = userId;

	
});

Users.before.remove(function(userId, doc) {
	
});

Users.after.insert(function(userId, doc) {
	
});

Users.after.update(function(userId, doc, fieldNames, modifier, options) {
	
});

Users.after.remove(function(userId, doc) {
	
});

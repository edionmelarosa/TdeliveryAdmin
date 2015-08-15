Meteor.publish("products", function() {
	return Products.find({}, {});
});

Meteor.publish("products_empty", function() {
	return Products.find({_id:null}, {});
});

Meteor.publish("product", function(customerId) {
	return Products.find({_id:productId}, {});
});


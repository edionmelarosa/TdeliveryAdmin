var pageSession = new ReactiveDict();

Template.Products.rendered = function() {
	
};

Template.Products.events({
	
});

Template.Products.helpers({
	
});

var ProductsViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("ProductsViewSearchString");
	var sortBy = pageSession.get("ProductsViewSortBy");
	var sortAscending = pageSession.get("ProductsViewSortAscending");
	if(typeof(sortAscending) == "undefined") sortAscending = true;

	var raw = cursor.fetch();

	console.log(raw);
	// filter
	var filtered = [];
	if(!searchString || searchString == "") {
		filtered = raw;
	} else {
		searchString = searchString.replace(".", "\\.");
		var regEx = new RegExp(searchString, "i");
		var searchFields = ["name", "phone", "email", "username", "roles"];
		filtered = _.filter(raw, function(item) {
			var match = false;
			_.each(searchFields, function(field) {
				var value = (getPropertyValue(field, item) || "") + "";

				match = match || (value && value.match(regEx));
				if(match) {
					return false;
				}
			})
			return match;
		});
	}

	// sort
	if(sortBy) {
		filtered = _.sortBy(filtered, sortBy);

		// descending?
		if(!sortAscending) {
			filtered = filtered.reverse();
		}
	}

	return filtered;
};

var ProductsViewExport = function(cursor, fileType) {
	var data = ProductsViewItems(cursor);
	var exportFields = ["name", "phone", "email", "username", "roles"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.ProductsView.rendered = function() {
	pageSession.set("ProductsViewStyle", "table");
	
};

Template.ProductsView.events({
	"submit #dataview-controls": function(e, t) {
		return false;
	},

	"click #dataview-search-button": function(e, t) {
		e.preventDefault();
		var form = $(e.currentTarget).parent();
		if(form) {
			var searchInput = form.find("#dataview-search-input");
			if(searchInput) {
				searchInput.focus();
				var searchString = searchInput.val();
				pageSession.set("ProductsViewSearchString", searchString);
			}

		}
		return false;
	},

	"keydown #dataview-search-input": function(e, t) {
		if(e.which === 13)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					var searchString = searchInput.val();
					pageSession.set("ProductsViewSearchString", searchString);
				}

			}
			return false;
		}

		if(e.which === 27)
		{
			e.preventDefault();
			var form = $(e.currentTarget).parent();
			if(form) {
				var searchInput = form.find("#dataview-search-input");
				if(searchInput) {
					searchInput.val("");
					pageSession.set("ProductsViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("products.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		ProductsViewExport(this.Products, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		ProductsViewExport(this.Products, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		ProductsViewExport(this.Products, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		ProductsViewExport(this.Products, "json");
	}

	
});

Template.ProductsView.helpers({

	

	"isEmpty": function() {
		return !this.Products || this.Products.count() == 0;
	},
	"isNotEmpty": function() {
		return this.Products && this.Products.count() > 0;
	},
	"isNotFound": function() {
		return this.Products && pageSession.get("ProductsViewSearchString") && ProductsViewItems(this.Products).length == 0;
	},
	"searchString": function() {
		return pageSession.get("ProductsViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("ProductsViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("ProductsViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("ProductsViewStyle") == "gallery";
	}

	
});


Template.ProductsViewTable.rendered = function() {
	
};

Template.ProductsViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("ProductsViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("ProductsViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("ProductsViewSortAscending") || false;
			pageSession.set("ProductsViewSortAscending", !sortAscending);
		} else {
			pageSession.set("ProductsViewSortAscending", true);
		}
	}
});

Template.ProductsViewTable.helpers({
	"tableItems": function() {
		console.log(ProductsViewItems(this.Products));
		return ProductsViewItems(this.Products);
	}
});


Template.ProductsViewTableItems.rendered = function() {
	
};

Template.ProductsViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		Router.go("Products.details", {customerId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Products.update({ _id: this._id }, { $set: values });

		return false;
	},

	"click #delete-button": function(e, t) {
		e.preventDefault();
		var me = this;
		bootbox.dialog({
			message: "Delete? Are you sure?",
			title: "Delete",
			animate: false,
			buttons: {
				success: {
					label: "Yes",
					className: "btn-success",
					callback: function() {
						Products.remove({ _id: me._id });
					}
				},
				danger: {
					label: "No",
					className: "btn-default"
				}
			}
		});
		return false;
	},
	"click #edit-button": function(e, t) {
		e.preventDefault();
		Router.go("Products.edit", {customerId: this._id});
		return false;
	}
});

Template.ProductsViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }
	

	
});

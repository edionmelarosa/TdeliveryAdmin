var pageSession = new ReactiveDict();

Template.Users.rendered = function() {
	
};

Template.Users.events({
	
});

Template.Users.helpers({
	
});

var UsersViewItems = function(cursor) {
	if(!cursor) {
		return [];
	}

	var searchString = pageSession.get("UsersViewSearchString");
	var sortBy = pageSession.get("UsersViewSortBy");
	var sortAscending = pageSession.get("UsersViewSortAscending");
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

var UsersViewExport = function(cursor, fileType) {
	var data = UsersViewItems(cursor);
	var exportFields = ["name", "phone", "email", "username", "roles"];

	var str = convertArrayOfObjects(data, exportFields, fileType);

	var filename = "export." + fileType;

	downloadLocalResource(str, filename, "application/octet-stream");
}


Template.UsersView.rendered = function() {
	pageSession.set("UsersViewStyle", "table");
	
};

Template.UsersView.events({
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
				pageSession.set("UsersViewSearchString", searchString);
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
					pageSession.set("UsersViewSearchString", searchString);
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
					pageSession.set("UsersViewSearchString", "");
				}

			}
			return false;
		}

		return true;
	},

	"click #dataview-insert-button": function(e, t) {
		e.preventDefault();
		Router.go("users.insert", {});
	},

	"click #dataview-export-default": function(e, t) {
		e.preventDefault();
		UsersViewExport(this.users, "csv");
	},

	"click #dataview-export-csv": function(e, t) {
		e.preventDefault();
		UsersViewExport(this.users, "csv");
	},

	"click #dataview-export-tsv": function(e, t) {
		e.preventDefault();
		UsersViewExport(this.users, "tsv");
	},

	"click #dataview-export-json": function(e, t) {
		e.preventDefault();
		UsersViewExport(this.users, "json");
	}

	
});

Template.UsersView.helpers({

	

	"isEmpty": function() {
		return !this.users || this.users.count() == 0;
	},
	"isNotEmpty": function() {
		return this.users && this.users.count() > 0;
	},
	"isNotFound": function() {
		return this.users && pageSession.get("UsersViewSearchString") && UsersViewItems(this.users).length == 0;
	},
	"searchString": function() {
		return pageSession.get("UsersViewSearchString");
	},
	"viewAsTable": function() {
		return pageSession.get("UsersViewStyle") == "table";
	},
	"viewAsList": function() {
		return pageSession.get("UsersViewStyle") == "list";
	},
	"viewAsGallery": function() {
		return pageSession.get("UsersViewStyle") == "gallery";
	}

	
});


Template.UsersViewTable.rendered = function() {
	
};

Template.UsersViewTable.events({
	"click .th-sortable": function(e, t) {
		e.preventDefault();
		var oldSortBy = pageSession.get("UsersViewSortBy");
		var newSortBy = $(e.target).attr("data-sort");

		pageSession.set("UsersViewSortBy", newSortBy);
		if(oldSortBy == newSortBy) {
			var sortAscending = pageSession.get("UsersViewSortAscending") || false;
			pageSession.set("UsersViewSortAscending", !sortAscending);
		} else {
			pageSession.set("UsersViewSortAscending", true);
		}
	}
});

Template.UsersViewTable.helpers({
	"tableItems": function() {
		console.log(UsersViewItems(this.users));
		return UsersViewItems(this.users);
	}
});


Template.UsersViewTableItems.rendered = function() {
	
};

Template.UsersViewTableItems.events({
	"click td": function(e, t) {
		e.preventDefault();
		Router.go("users.details", {customerId: this._id});
		return false;
	},

	"click .inline-checkbox": function(e, t) {
		e.preventDefault();

		if(!this || !this._id) return false;

		var fieldName = $(e.currentTarget).attr("data-field");
		if(!fieldName) return false;

		var values = {};
		values[fieldName] = !this[fieldName];

		Users.update({ _id: this._id }, { $set: values });

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
						Users.remove({ _id: me._id });
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
		Router.go("users.edit", {customerId: this._id});
		return false;
	}
});

Template.UsersViewTableItems.helpers({
	"checked": function(value) { return value ? "checked" : "" }
	

	
});

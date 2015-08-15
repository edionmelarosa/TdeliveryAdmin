var pageSession = new ReactiveDict();

Template.ProductsEdit.rendered = function() {
	
};

Template.ProductsEdit.events({
	
});

Template.ProductsEdit.helpers({
	
});

Template.ProductsEditEditForm.rendered = function() {
	

	pageSession.set("ProductsEditEditFormInfoMessage", "");
	pageSession.set("ProductsEditEditFormErrorMessage", "");

	$(".input-group.date").each(function() {
		var format = $(this).find("input[type='text']").attr("data-format");

		if(format) {
			format = format.toLowerCase();
		}
		else {
			format = "mm/dd/yyyy";
		}

		$(this).datepicker({
			autoclose: true,
			todayHighlight: true,
			todayBtn: true,
			forceParse: false,
			keyboardNavigation: false,
			format: format
		});
	});

	$("input[type='file']").fileinput();
	$("select[data-role='tagsinput']").tagsinput();
	$(".bootstrap-tagsinput").addClass("form-control");
	$("input[autofocus]").focus();
};

Template.ProductsEditEditForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ProductsEditEditFormInfoMessage", "");
		pageSession.set("ProductsEditEditFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ProductsEditEditFormMode = "update";
			if(!t.find("#form-cancel-button")) {
				switch(ProductsEditEditFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ProductsEditEditFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("Products", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ProductsEditEditFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				Meteor.call("updateUserAccount", t.data.customer._id, values, function(e) { if(e) errorAction(e); else submitAction(); });
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		Router.go("Products", {});
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		/*CLOSE_REDIRECT*/
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		/*BACK_REDIRECT*/
	}

	
});

Template.ProductsEditEditForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ProductsEditEditFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ProductsEditEditFormErrorMessage");
	}
	
});

var pageSession = new ReactiveDict();

Template.ProductsInsert.rendered = function() {
	
};

Template.ProductsInsert.events({
	
});

Template.ProductsInsert.helpers({
	
});

Template.ProductsInsertInsertForm.rendered = function() {
	

	pageSession.set("ProductsInsertInsertFormInfoMessage", "");
	pageSession.set("ProductsInsertInsertFormErrorMessage", "");

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

Template.ProductsInsertInsertForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ProductsInsertInsertFormInfoMessage", "");
		pageSession.set("ProductsInsertInsertFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ProductsInsertInsertFormMode = "insert";
			if(!t.find("#form-cancel-button")) {
				switch(ProductsInsertInsertFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ProductsInsertInsertFormInfoMessage", message);
					}; break;
				}
			}

			Router.go("products", {});
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ProductsInsertInsertFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				
				console.log(values);
				Meteor.call("addProducts", values, function(e) { if(e) errorAction(e); else submitAction(); });
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

Template.ProductsInsertInsertForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ProductsInsertInsertFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ProductsInsertInsertFormErrorMessage");
	}
	
});

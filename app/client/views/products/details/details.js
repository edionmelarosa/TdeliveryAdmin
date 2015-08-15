var pageSession = new ReactiveDict();

Template.ProductsDetails.rendered = function() {
	
};

Template.ProductsDetails.events({
	
});

Template.ProductsDetails.helpers({
	
});

Template.ProductsDetailsDetailsForm.rendered = function() {
	

	pageSession.set("ProductsDetailsDetailsFormInfoMessage", "");
	pageSession.set("ProductsDetailsDetailsFormErrorMessage", "");

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

Template.ProductsDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("ProductsDetailsDetailsFormInfoMessage", "");
		pageSession.set("ProductsDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var ProductsDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(ProductsDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("ProductsDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("ProductsDetailsDetailsFormErrorMessage", message);
		}

		validateForm(
			$(e.target),
			function(fieldName, fieldValue) {

			},
			function(msg) {

			},
			function(values) {
				

				
			}
		);

		return false;
	},
	"click #form-cancel-button": function(e, t) {
		e.preventDefault();

		

		/*CANCEL_REDIRECT*/
	},
	"click #form-close-button": function(e, t) {
		e.preventDefault();

		Router.go("Products", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("Products", {});
	}

	
});

Template.ProductsDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("ProductsDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("ProductsDetailsDetailsFormErrorMessage");
	}
	
});

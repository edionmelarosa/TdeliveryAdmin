var pageSession = new ReactiveDict();

Template.UsersDetails.rendered = function() {
	
};

Template.UsersDetails.events({
	
});

Template.UsersDetails.helpers({
	
});

Template.UsersDetailsDetailsForm.rendered = function() {
	

	pageSession.set("usersDetailsDetailsFormInfoMessage", "");
	pageSession.set("usersDetailsDetailsFormErrorMessage", "");

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

Template.UsersDetailsDetailsForm.events({
	"submit": function(e, t) {
		e.preventDefault();
		pageSession.set("usersDetailsDetailsFormInfoMessage", "");
		pageSession.set("usersDetailsDetailsFormErrorMessage", "");

		var self = this;

		function submitAction(msg) {
			var usersDetailsDetailsFormMode = "read_only";
			if(!t.find("#form-cancel-button")) {
				switch(usersDetailsDetailsFormMode) {
					case "insert": {
						$(e.target)[0].reset();
					}; break;

					case "update": {
						var message = msg || "Saved.";
						pageSession.set("usersDetailsDetailsFormInfoMessage", message);
					}; break;
				}
			}

			/*SUBMIT_REDIRECT*/
		}

		function errorAction(msg) {
			msg = msg || "";
			var message = msg.message || msg || "Error.";
			pageSession.set("usersDetailsDetailsFormErrorMessage", message);
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

		Router.go("users", {});
	},
	"click #form-back-button": function(e, t) {
		e.preventDefault();

		Router.go("users", {});
	}

	
});

Template.UsersDetailsDetailsForm.helpers({
	"infoMessage": function() {
		return pageSession.get("usersDetailsDetailsFormInfoMessage");
	},
	"errorMessage": function() {
		return pageSession.get("usersDetailsDetailsFormErrorMessage");
	}
	
});

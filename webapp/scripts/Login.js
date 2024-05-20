sap.ui.define([
	"br/com/bioindica/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/m/MessageBox"
], function(
	BaseController,
	Controller,
	JSONModel,
	MessageBox
) {
	"use strict";

	return BaseController.extend("br.com.bioindica.scripts.Login", {

		/**
		 * @constructor
		 * @override
		 * @public
		 * @param {sap.ui.core.mvc.Controller} oController Controller object
		 * @returns {void}
		 */
		constructor: function(oController) {
			Controller.apply(this, arguments);
			this._oController = oController;
			this._oViewController = this._oController.getView();

			// Load the view model
			this._oViewModelLogin = new JSONModel(this.createViewModelLogin());
			this._oViewController.setModel(this._oViewModelLogin, "viewModelLogin");

			this._getFormDataAndControls();
		},

		/**
		 * Get the values and controls of the form - Login
		 * @private
		 * @returns {void}
		 */
		_getFormDataAndControls: function() {
			this._oFormLoginValues = this._oViewModelLogin.getProperty("/Login");
			this._oFormLoginControl = this._oViewModelLogin.getProperty("/LoginControl");
		},

		/**
		 * Set the values and controls of the form - Login
		 * @private
		 * @returns {void}
		 */
		_setFormDataAndControls: function() {
			this._oViewModelLogin.setProperty("/Login", this._oFormLoginValues);
			this._oViewModelLogin.setProperty("/LoginControl", this._oFormLoginControl);
		},

		/**
		 * Submit the login form
		 * @public
		 * @returns {void}
		 */
		submitLogin: function() {
			var bEmailIsValid = this.checkEmailField();
			var bPasswordIsValid = this.checkPasswordField();

			if (bEmailIsValid && bPasswordIsValid) {
				// Call the login service (Backend)
				return;
			}
			MessageBox.error(this._oController.getTextMain("stateErrorLogin"));
		},

		/**
		 * Check if the email is valid
		 * @public
		 * @returns {boolean} Returns true if the email is valid
		 */
		checkEmailField: function() {
			this._getFormDataAndControls();

			var sEmail = this._oFormLoginValues.Email;
			var sErrorText = this._oController.getTextMain(
				"formThisFieldIsRequired",
				[this._oController.getTextMain("formEmail")]
			);
			var sErrorTextInvalid = this._oController.getTextMain("stateErrorInvalidEmail");

			if (sEmail) {
				var bEmailIsValid = this.checkEmail(sEmail);

				if (bEmailIsValid) {
					this._oFormLoginControl.EmailInput = {
						ValueState: "None",
						ValueStateText: ""
					};
					this._setFormDataAndControls();
					return true;
				}
				this._oFormLoginControl.EmailInput = {
					ValueState: "Error",
					ValueStateText: sErrorTextInvalid
				};
			} else {
				this._oFormLoginControl.EmailInput = {
					ValueState: "Error",
					ValueStateText: sErrorText
				};
			}
			this._setFormDataAndControls();
			return false;
		},

		/**
		 * Check the password is valid
		 * @public
		 * @param {string} sPassword The password value
		 * @returns {boolean} Returns true if the password is valid
		 */
		checkPasswordField: function() {
			this._getFormDataAndControls();

			var sPassword = this._oFormLoginValues.Password;
			var sErrorText = this._oController.getTextMain(
				"formThisFieldIsRequired",
				[this._oController.getTextMain("formPassword")]
			);

			if (sPassword) {
				var bPasswordIsValid = this.checkPassword(sPassword);

				if (bPasswordIsValid) {
					this._oFormLoginControl.PasswordInput = {
						ValueState: "None",
						ValueStateText: ""
					};
					this._setFormDataAndControls();
					return true;
				}
				this._oFormLoginControl.PasswordInput = {
					ValueState: "Error",
					ValueStateText: this._oController.getTextMain("stateErrorInvalidPassword")
				};
			} else {
				this._oFormLoginControl.PasswordInput = {
					ValueState: "Error",
					ValueStateText: sErrorText
				};
			}
			this._setFormDataAndControls();
			return false;
		}



	});
});

sap.ui.define([
	"br/com/bioindica/controller/BaseController",
	"br/com/bioindica/scripts/Login",
	"sap/ui/model/json/JSONModel"
], function (
	BaseController,
	Login,
	JSONModel
) {
	"use strict";

	return BaseController.extend("br.com.bioindica.controller.Main", {

		onInit: function () {

			this._oRouter = this.getRouter();
			this._oView = this.getView();
			this._oModel = this.getModel();

			this._oViewModel = new JSONModel(this.createViewModelGeneral());
			this._oView.setModel(this._oViewModel, "viewModel");

			this._oLogin = new Login(this);

			// Set the density class of the app
			this._oView.addStyleClass(this.getOwnerComponent().getContentDensityClass());
		},

		getTextMain: function (sKey, aArgs) {
			return this.getResourceBundle().getText(sKey, aArgs);
		},

		/*
		 * Submit the login form
		 */
		onSubmitLogin: function(oEvent) {
			this._oLogin.submitLogin();
		},

		/*
		 * Check the Email Field - Login Form
		 */
		onCheckEmailField: function(oEvent) {
			this._oLogin.checkEmailField();
		},

		/*
		 * Check the Password Field - Login Form
		 */
		onCheckPasswordField: function(oEvent) {
			this._oLogin.checkPasswordField();
		}

	});
});

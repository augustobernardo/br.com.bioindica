sap.ui.define([
	"br/com/bioindica/controller/BaseController",
	"br/com/bioindica/scripts/Home"
], function(
	BaseController,
	Home
) {
	"use strict";

	return BaseController.extend("br.com.bioindica.controller.Home", {

		onInit: function () {
			this._oView = this.getView();
			this._oModel = this._oView.getModel();
			this._oRouter = this.getOwnerComponent().getRouter();

			this._oHome = new Home(this);

			this._oRouter.attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {

		},

		getTextHome: function (sKey, aArgs) {
			return this.getResourceBundle().getText(sKey, aArgs);
		},

		onClearNewUser: function (oEvent) {
			this._oHome.clearFormNewUser();
		},

		onSaveNewUser: function (oEvent) {
			this._oHome.saveNewUser();
		},

		onShowSettingDialog: function(oEvent) {
			this._oHome.showSettingDialog();
		},

		onDeleteUser: function (oEvent) {
			this._oHome.deleteUser(oEvent);
		},

		onUsersTableSelectionChange: function (oEvent) {
			this._oHome.usersTableSelectionChange(oEvent);
		},

		onEditUser: function (oEvent) {
			this._oHome.editUser(oEvent);
		},
	});
});

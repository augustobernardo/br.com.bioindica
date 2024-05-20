sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"br/com/bioindica/scripts/Home"
], function(
	Controller,
	Home
) {
	"use strict";

	return Controller.extend("br.com.bioindica.controller.Home", {

		onInit: function () {
			this._oView = this.getView();
			this._oModel = this._oView.getModel();
			this._oRouter = this.getOwnerComponent().getRouter();

			this._oHome = new Home(this);

			this._oRouter.attachRoutePatternMatched(this._onRouteMatched, this);
		},

		_onRouteMatched: function (oEvent) {

		},

	});
});

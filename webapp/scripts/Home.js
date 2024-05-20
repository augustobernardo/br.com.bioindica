sap.ui.define([
	"br/com/bioindica/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
], function(
	BaseController,
	Controller,
	JSONModel
) {
	"use strict";

	return BaseController.extend("br.com.bioindica.scripts.Home", {

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
			this._oRouterController = this._oController.getOwnerComponent().getRouter();

			// Load the view model
			this._oHomeViewModel = new JSONModel(this.createViewModelHome());
			this._oViewController.setModel(this._oHomeViewModel, "homeViewModel");

			this._getFormDataAndControls();
		},


		/**
		 * Get the values and controls of the form - Home
		 * @private
		 * @returns {void}
		 */
		_getFormDataAndControls: function() {
			this._oTableHome = this._oHomeViewModel.getProperty("/TabelaUsuarios");
			this._oUser = this._oHomeViewModel.getProperty("/Usuario");
			this._oFormHomeControl = this._oHomeViewModel.getProperty("/HomeControl");
		},

		/**
		 * Set the values and controls of the form - Home
		 * @private
		 * @returns {void}
		 */
		// _setFormDataAndControls: function() {
		// 	this._oHomeViewModel.setProperty("/TabelaUsuarios", this._oTableHome);
		// 	this._oHomeViewModel.setProperty("/Usuario", this._oUser);
		// 	this._oHomeViewModel.setProperty("/HomeControl", this._oFormHomeControl);
		// },


		refreshTableHome: function() {
			this._oTableHome = this._oHomeViewModel.getProperty("/TabelaUsuarios");
			this._oTableHome.refresh();
		},


	});
});

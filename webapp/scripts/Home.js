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
		_setFormDataAndControls: function() {
			this._oHomeViewModel.setProperty("/TabelaUsuarios", this._oTableHome);
			this._oHomeViewModel.setProperty("/Usuario", this._oUser);
			this._oHomeViewModel.setProperty("/HomeControl", this._oFormHomeControl);
		},

		/**
		 * Create a new user object
		 * @public
		 * @returns {void}
		 */
		_clearNewUser: function() {
			this._oUser = {
				Nome: "",
				Email: "",
				Cpf: "",
				Telefone: ""
			};
		},

		/**
		 * Clear the form - Home
		 * @public
		 * @returns {void}
		 */
		clearFormNewUser: function() {
			this._clearNewUser();
			this._setFormDataAndControls();
		},

		/**
		 * Save the new user
		 * @public
		 * @returns {void}
		 */
		saveNewUser: function() {
			this._getFormDataAndControls();
			var oHaveError = this._checkHomeForm();
			var bHaveError = false;

			// Check if there is any error
			for (var sKey in oHaveError) {
				if (oHaveError[sKey]) {
					bHaveError = true;
					break;
				}
			}

			if (bHaveError) {
				this._setFormDataAndControls();
				return;
			}

			this._oTableHome.push(this._oUser);
			this.clearFormNewUser();
		},

		_checkHomeForm: function() {
			return {
				NomeError: this._checkHomeFormNome(),
				EmailError: this._checkHomeFormEmail(),
				CpfError: this._checkHomeFormCpf(),
				TelefoneError: this._checkHomeFormTelefone(),
			}
		},

		/**
		 * Check the Nome Field - Home Form
		 * @public
		 * @returns {void}
		 */
		_checkHomeFormNome: function() {
			var sNameField = this._oController.getTextHome("homeFormName", []);
			var sErrorMessage = this._oController.getTextHome("formThisFieldIsRequired", [sNameField]);

			if (!this._oUser.Nome) {
				this._oFormHomeControl.Nome.ValueState = "Error";
				this._oFormHomeControl.Nome.ValueStateText = sErrorMessage;
				return true;
			}
			this._oFormHomeControl.Nome.ValueState = "None";
			this._oFormHomeControl.Nome.ValueStateText = "";
			return false;
		},

		/**
		 * Check the Email Field - Home Form
		 * @public
		 * @returns {void}
		 */
		_checkHomeFormEmail: function() {
			var sEmailField = this._oController.getTextHome("homeFormEmail", []);
			var sErrorMessage = this._oController.getTextHome("formThisFieldIsRequired", [sEmailField]);

			if (!this._oUser.Email) {
				this._oFormHomeControl.Email.ValueState = "Error";
				this._oFormHomeControl.Email.ValueStateText = sErrorMessage;
				return true;
			}

			if (this.checkEmail(this._oUser.Email)) {
				this._oFormHomeControl.Email.ValueState = "Error";
				this._oFormHomeControl.Email.ValueStateText = this._oController.getTextHome("stateErrorInvalidEmail", []);
				return true;
			}

			this._oFormHomeControl.Email.ValueState = "None";
			this._oFormHomeControl.Email.ValueStateText = "";
			return false;
		},

		/**
		 * Check the Home Field - Home Form
		 * @public
		 * @returns {void}
		 */
		_checkHomeFormCpf: function() {
			var sCpfField = this._oController.getTextHome("homeFormCPF", []);
			var sErrorMessage = this._oController.getTextHome("formThisFieldIsRequired", [sCpfField]);

			if (!this._oUser.Cpf) {
				this._oFormHomeControl.Cpf.ValueState = "Error";
				this._oFormHomeControl.Cpf.ValueStateText = sErrorMessage;
				return true;
			}
			this._oFormHomeControl.Cpf.ValueState = "None";
			this._oFormHomeControl.Cpf.ValueStateText = "";
			return false;
		},

		/**
		 * Check the Telefone Field - Home Form
		 * @public
		 * @returns {void}
		 */
		_checkHomeFormTelefone: function() {
			var sTelefoneField = this._oController.getTextHome("homeFormPhone", []);
			var sErrorMessage = this._oController.getTextHome("formThisFieldIsRequired", [sTelefoneField]);

			if (!this._oUser.Telefone) {
				this._oFormHomeControl.Telefone.ValueState = "Error";
				this._oFormHomeControl.Telefone.ValueStateText = sErrorMessage;
				return true;
			}
			this._oFormHomeControl.Telefone.ValueState = "None";
			this._oFormHomeControl.Telefone.ValueStateText = "";
			return false;
		},

		/**
		 * Show the setting dialog
		 * @public
		 * @returns {void}
		 */
		showSettingDialog: function() {
		    this._oSettingsDialog =	this._oViewController.byId("idSettingsDialog");

			if (!this._oSettingsDialog) {
				this._oSettingsDialog = sap.ui.xmlfragment("br.com.bioindica.view.fragments.SettingsDialog", this);
				this._oViewController.addDependent(this._oSettingsDialog);
			}
			this._oSettingsDialog.open();
		},

		/**
		 * Handle the Select Theme change event.
		 * @param {sap.ui.base.Event} oEvent The event object
		 * @public
		 */
		onChangeSelectTheme: function(oEvent) {
			var sTheme = oEvent.getSource().getSelectedKey();

			if (sTheme == "sap_horizon") {
				this._oHomeViewModel.setProperty("/Configs/Theme", sTheme);
			} else {
				this._oHomeViewModel.setProperty("/Configs/Theme", sTheme);
			}
		},

		/**
		 * Handle the Select Language change event.
		 * @param {sap.ui.base.Event} oEvent The event object
		 * @public
		 */
		onChangeSelectLanguage: function(oEvent) {
			var sLanguage = oEvent.getSource().getSelectedKey();
			this._oHomeViewModel.setProperty("/Configs/Language", sLanguage);
		},

		/**
		 * Save the configuration
		 * @public
		 * @returns {void}
		 */
		onSaveConfig: function () {
			var oConfigs = this._oHomeViewModel.getProperty("/Configs");

			if (oConfigs.Theme == "system") {
				oConfigs.Theme = this.getSystemTheme();
			}

			if (oConfigs.Language == "system") {
				oConfigs.Language = this.getSystemLanguage();
			}

			this.applyTheme(oConfigs.Theme);
			this.applyLanguage(oConfigs.Language);
		},

		onCloseConfigDialog: function(oEvent) {
			this._oSettingsDialog.close();
		},
	});
});

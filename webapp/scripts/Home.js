sap.ui.define([
	"br/com/bioindica/controller/BaseController",
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/table/Table",
	"sap/m/MessageBox",
], function(
	BaseController,
	Controller,
	JSONModel,
	Table,
	MessageBox
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
			this._setTitleTableHome();
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

		_setTitleTableHome: function() {
			var sQuantityUsers = this._oTableHome.length;
			this._oHomeViewModel.setProperty("/TitleTableHome", this._oController.getTextHome("homeTableUsers", [sQuantityUsers]));
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

			// check if the CPF and Email is already registered
			if (this._checkCpfAndEmailIsRegistered()) {
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

		_checkCpfAndEmailIsRegistered: function() {
			var sCpf = this._oUser.Cpf;
			var sEmail = this._oUser.Email;

			var bCpfIsRegistered = this._oTableHome.some(function(oUser) {
				return oUser.Cpf == sCpf;
			}, this);

			if (bCpfIsRegistered) {
				this._oFormHomeControl.Cpf.ValueState = "Error";
				this._oFormHomeControl.Cpf.ValueStateText = this._oController.getTextHome("stateErrorCpfAlreadyRegistered", []);
			} else {
				this._oFormHomeControl.Cpf.ValueState = "None";
				this._oFormHomeControl.Cpf.ValueStateText = "";
			}

			var bEmailIsRegistered = this._oTableHome.some(function(oUser) {
				return oUser.Email == sEmail;
			});

			if (bEmailIsRegistered) {
				this._oFormHomeControl.Email.ValueState = "Error";
				this._oFormHomeControl.Email.ValueStateText = this._oController.getTextHome("stateErrorEmailAlreadyRegistered", []);
			} else {
				this._oFormHomeControl.Email.ValueState = "None";
				this._oFormHomeControl.Email.ValueStateText = "";
			}

			this._oHomeViewModel.setProperty("/HomeControl", this._oFormHomeControl);
			return bCpfIsRegistered || bEmailIsRegistered;
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

			if (!this.checkEmail(this._oUser.Email)) {
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

		/**
		 * Close the setting dialog
		 * @public
		 * @param {sap.ui.base.Event} oEvent The event object
		 * @returns {void}
		 */
		onCloseConfigDialog: function(oEvent) {
			this._oSettingsDialog.close();
			this._oSettingsDialog.destroy();
		},

		/**
		 * Handle the table selection change event.
		 * @param {sap.ui.base.Event} oEvent The event object
		 * @public
		 */
		usersTableSelectionChange: function(oEvent) {
			var oTable = oEvent.getSource();
			this._oHomeViewModel.setProperty("/TabelaUsuariosConfigs/SelectedIndices", oTable.getSelectedIndices());
		},

		/**
		 * Delete the user
		 * @public
		 * @param {sap.ui.base.Event} oEvent The event object
		 * @returns {void}
		 */
		deleteUser: function(oEvent) {
			var aSelectedIndices = this._oHomeViewModel.getProperty("/TabelaUsuariosConfigs/SelectedIndices");
			var aTableHome = this._oHomeViewModel.getProperty("/TabelaUsuarios");

			for (var i = aSelectedIndices.length - 1; i >= 0; i--) {
				aTableHome.splice(aSelectedIndices[i], 1);
			}

			this._oHomeViewModel.setProperty("/TabelaUsuarios", aTableHome);
			this._setFormDataAndControls();
			this._setTitleTableHome();
		},

		/**
		 * Edit the user
		 * @public
		 * @param {sap.ui.base.Event} oEvent The event object
		 * @returns {void}
		 */
		editUser: function(oEvent) {
			this._aTableAux = this._oHomeViewModel.getProperty("/TabelaUsuarios");
			this._oHomeViewModel.setProperty("/TabelaEditUsuarios", this._aTableAux);
			this._oHomeViewModel.setProperty("/EditableTable/Visible", true);
		},

		/**
		 * Save the edited users
		 * @public
		 * @param {sap.ui.base.Event} oEvent The event object
		 * @returns {void}
		 */
		saveEditUser: function(oEvent) {
			this._oTableHome  = this._oHomeViewModel.getProperty("/TabelaUsuarios");

			if (this._checkTableEditUsers()) {
				return;
			}

			this._setFormDataAndControls();
			this._oHomeViewModel.setProperty("/EditableTable/Visible", false);
			this._setTitleTableHome();
		},

		_checkTableEditUsers: function() {
			// check if the CPF and Email is already registered
			var bHaveError = false;
			var aTableEditUsers = this._oHomeViewModel.getProperty("/TabelaEditUsuarios");

			for (var i = 0; i < aTableEditUsers.length; i++) {
				// check if the CPF and Email is already registered
				if (this._oTableHome.some(function(oUser) {
					return oUser.Cpf == aTableEditUsers[i].Cpf && oUser.Email == aTableEditUsers[i].Email;
				})) {					
					bHaveError = true;
					break;
				}
			}

			if (bHaveError) {
				this._oHomeViewModel.setProperty("/EditableTable/Visible", true);
				
				MessageBox.error(
					this._oController.getTextHome("stateErrorCpfAndEmailAlreadyRegistered", []),
					{
						actions: [MessageBox.Action.OK],
						onClose: function() {
							return;
						}
					}
				);
				return true;
			}
		},

		/**
		 * Cancel the edited users
		 * @public
		 * @param {sap.ui.base.Event} oEvent The event object
		 * @returns {void}
		 */
		cancelEditUser: function(oEvent) {
			this._oHomeViewModel.setProperty("/TabelaUsuarios", this._aTableAux);

			this._oHomeViewModel.setProperty("/EditableTable/Visible", false);
		},

	});
});

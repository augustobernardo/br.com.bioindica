sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/core/UIComponent",
	"sap/ui/core/routing/History"
], function (
	Controller,
	UIComponent,
	History
) {
	"use strict";

	return Controller.extend("br.com.bioindica.controller.BaseController", {
		/**
		 * Convenience method for accessing the component of the controller's view.
		 * @returns {sap.ui.core.Component} The component of the controller's view
		 */
		getOwnerComponent: function () {
			return Controller.prototype.getOwnerComponent.call(this);
		},

		/**
		 * Convenience method to get the components' router instance.
		 * @returns {sap.m.routing.Router} The router instance
		 */
		getRouter: function () {
			return UIComponent.getRouterFor(this);
		},

		/**
		 * Convenience method for getting the i18n resource bundle of the component.
		 * @returns {sap.base.i18n.ResourceBundle} The i18n resource bundle of the component
		 */
		getResourceBundle: function () {
			var oModel = this.getOwnerComponent().getModel("i18n");
			return oModel.getResourceBundle();
		},

		/**
		 * Convenience method for getting the view model by name in every controller of the application.
		 * @param {string} [sName] The model name
		 * @returns {sap.ui.model.Model} The model instance
		 */
		getModel: function (sName) {
			return this.getView().getModel(sName);
		},

		/**
		 * Get the language of the application.
		 * @returns {string} The language of the application
		 * @public
		 */
		getLanguage: function () {
			return sap.ui.getCore().getConfiguration().getLanguage();
		},

		/**
		 * Get the system language of the user.
		 * @returns {string} The system language of the user
		 * @public
		 */
		getSystemLanguage: function () {
			var userLocale =
				navigator.languages && navigator.languages.length
					? navigator.languages[0]
					: navigator.language;

			return userLocale;
		},

		/**
		 * Convenience method for setting the view model in every controller of the application.
		 * @param {sap.ui.model.Model} oModel The model instance
		 * @param {string} [sName] The model name
		 * @returns {sap.ui.core.mvc.Controller} The current base controller instance
		 */
		setModel: function (oModel, sName) {
			this.getView().setModel(oModel, sName);
			return this;
		},

		/**
		 * Convenience method for triggering the navigation to a specific target.
		 * @public
		 * @param {string} sName Target name
		 * @param {object} [oParameters] Navigation parameters
		 * @param {boolean} [bReplace] Defines if the hash should be replaced (no browser history entry) or set (browser history entry)
		 */
		navTo: function (sName, oParameters, bReplace) {
			this.getRouter().navTo(sName, oParameters, undefined, bReplace);
		},

		/**
		 * Convenience event handler for navigating back.
		 * It there is a history entry we go one step back in the browser history
		 * If not, it will replace the current entry of the browser history with the main route.
		 */
		onNavBack: function () {
			var sPreviousHash = History.getInstance().getPreviousHash();
			if (sPreviousHash !== undefined) {
				window.history.go(-1);
			} else {
				this.getRouter().navTo("main", {}, undefined, true);
			}
		},

		/**
		 * Convenience method for getting the translated text from the i18n resource bundle.
		 * @param {string} sKey The key of the text
		 * @param {array} [aArgs] The arguments for the text
		 * @returns {string} The translated text
		 * @public
		 */
		getText: function (sKey, aArgs) {
			var oResourceBundle = this.getResourceBundle();
			return oResourceBundle.getText(sKey, aArgs);
		},

		/**
		 * Create the view model instance.
		 * @returns {object} The view model instance
		 * @public
		 * @abstract
		 */
		createViewModelGeneral: function () {
			return {
				isLogged: false,
			};
		},

		/**
		 * Create the Login view model instance.
		 * @returns {object} The view model instance
		 * @public
		 * @abstract
		 */
		createLoginViewModel: function () {
			return {
				Login: {
					Email: "",
					Password: "",
					RemeberMe: false
				},
				LoginControl: {
					EmailInput: {
						ValueState: "None",
						ValueStateText: ""
					},
					PasswordInput: {
						ValueState: "None",
						ValueStateText: ""
					},
				},
			}
		},

		/**
		 * Create the Register view model instance.
		 * @returns {object} The view model instance
		 * @public
		 * @abstract
		 */
		createViewModelRegister: function () {
			return {
				Register: {
					Email: "",
					Password: "",
					ConfirmPassword: ""
				},
				RegisterControl: {
					EmailInput: {
						Value: "",
						ValueState: "None",
						ValueStateText: ""
					},
					PasswordInput: {
						Value: "",
						ValueState: "None",
						ValueStateText: ""
					},
					ConfirmPasswordInput: {
						Value: "",
						ValueState: "None",
						ValueStateText: ""
					},
				}
			}
		},

		/**
		 * Create the Home view model instance.
		 * @returns {object} The view model instance
		 * @public
		 * @abstract
		 */
		createViewModelHome: function () {
			return {
				TabelaUsuarios: [
					{
						Nome: "John Doe",
						Email: "john.doe@example.com",
						Cpf: "123.456.789-00",
						Telefone: "(123) 456-7890"
					},
					{
						Nome: "Jane Doe",
						Email: "jane.doe@example.com",
						Cpf: "987.654.321-00",
						Telefone: "(987) 654-3210"
					}
				],
				TabelaUsuariosConfigs: {
					SelectedIndices: []
				},
				Usuario: {
					Nome: "",
					Email: "",
					Cpf: "",
					Telefone: ""
				},
				HomeControl: {
					Nome: {
						ValueState: "None",
						ValueStateText: ""
					},
					Email: {
						ValueState: "None",
						ValueStateText: ""
					},
					Cpf: {
						ValueState: "None",
						ValueStateText: ""
					},
					Telefone: {
						ValueState: "None",
						ValueStateText: ""
					},
				},
				Configs: {
					Theme: "",
					Language: ""
				}
			}
		},

		/**
		 * Check the email value.
		 * @public
		 * @abstract
		 * @param {string} sEmail The email value
		 * @returns {boolean} Returns true if the value is valid
		 */
		checkEmail: function (sEmail) {
			// Validate the email
			var oRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
			return oRegex.test(sEmail);
		},

		/**
		 * Check the password value.
		 * @public
		 * @abstract
		 * @param {string} sPassword The password value
		 * @returns {boolean} Returns true if the value is valid
		 */
		checkPassword: function (sPassword) {
			// Minimum eight characters, including letters, numbers and special characters
			var oRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[$@$!%*#?&])[A-Za-z\d$@$!%*#?&]{8,}$/;
			return oRegex.test(sPassword);
		},

		/**
		 * Get the system theme of the user.
		 * @public
		 */
		getSystemTheme: function () {
			var bDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
			sap.ui.getCore().applyTheme(bDarkTheme.matches ? "sap_horizon_dark" : "sap_horizon");
		},

		/**
		 * Get the system theme of the user.
		 * @returns {string} The system theme of the user
		 * @public
		 */
		_getSystemTheme: function () {
			var bDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
			return bDarkTheme.matches ? "sap_horizon_dark" : "sap_horizon";
		},

		/**
		 * Apply the selected theme.
		 * @param {string} sTheme The theme name
		 * @public
		 */
		applyTheme: function(sTheme) {
			sap.ui.getCore().applyTheme(sTheme || this._getSystemTheme());
		},

		/**
		 * Apply the selected language.
		 * @param {string} sLanguage The language name
		 * @public
		 */
		applyLanguage: function(sLanguage) {
			sap.ui.getCore().getConfiguration().setLanguage(sLanguage || this.getSystemLanguage());
		},


	});
});

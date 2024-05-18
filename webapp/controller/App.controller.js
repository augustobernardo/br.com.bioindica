sap.ui.define(["./BaseController"], function (BaseController) {
	"use strict";

	return BaseController.extend("br.com.bioindica.controller.App", {
		onInit: function () {
			this.getView().addStyleClass(
				this.getOwnerComponent().getContentDensityClass()
			);

			var bDarkTheme = window.matchMedia("(prefers-color-scheme: dark)");
			sap.ui.getCore().applyTheme(bDarkTheme.matches ? "sap_horizon_dark" : "sap_horizon");
		},
	});
});

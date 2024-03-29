let config = {
	address: "0.0.0.0", 	// Address to listen on, can be:
							// - "localhost", "127.0.0.1", "::1" to listen on loopback interface
							// - another specific IPv4/6 to listen on a specific interface
							// - "0.0.0.0", "::" to listen on any interface
							// Default, when address config is left out or empty, is "localhost"
	port: 8080,
	basePath: "/", 	// The URL path where MagicMirror is hosted. If you are using a Reverse proxy
					// you must set the sub path here. basePath must end with a /
	ipWhitelist: [], 	// Set [] to allow all IP addresses
										// or add a specific IPv4 of 192.168.1.5 :
										// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.1.5"],
										// or IPv4 range of 192.168.3.0 --> 192.168.3.15 use CIDR format :
										// ["127.0.0.1", "::ffff:127.0.0.1", "::1", "::ffff:192.168.3.0/28"],

	useHttps: false, 		// Support HTTPS or not, default "false" will use HTTP
	httpsPrivateKey: "", 	// HTTPS private key path, only require when useHttps is true
	httpsCertificate: "", 	// HTTPS Certificate path, only require when useHttps is true

	language: "en",
	locale: "en-US",
	logLevel: ["INFO", "LOG", "WARN", "ERROR"], // Add "DEBUG" for even more logging
	timeFormat: 24,
	units: "metric",
	// serverOnly:  true/false/"local" ,
	// local for armv6l processors, default
	//   starts serveronly and then starts chrome browser
	// false, default for all NON-armv6l devices
	// true, force serveronly mode, because you want to.. no UI on this device


	// BEGIN PARSER
	modules: [
		{
			module: "alert",
			config: {uni_id:""},
		},
		{
			module: "updatenotification",
			position: "top_bar",
			config: {uni_id:"" },
		},
		{
			module: "clock",
			position: "top_left",
			config: {uni_id:"clock_1"},
		},
		{
			module: "clock",
			position: "top_left",
			config: {uni_id:"clock_2"},
		},
		{
			module: "calendar",
			header: "Calendar",
			position: "top_left",
			config: {
				uni_id: "calendar_1",
				calendars: [
				]
			}
		},
		{
			module: "weather",
			position: "top_right",
			config: {
				uni_id: "weather_1",
				weatherProvider: "openweathermap",
				type: "forecast",
				location: "Konstanz",
				locationID: "2885679", 
				apiKey: "28f8833d6494314b297aba01d98a6f72"
			}
		},
		{
			module: "weather",
			position: "top_right",
			config: {
				uni_id: "weather_2",
				weatherProvider: "openweathermap",
				type: "forecast",
				location: "Stuttgart",
				locationID: "2825297", 
				apiKey: "28f8833d6494314b297aba01d98a6f72"
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				uni_id: "news_1",
				feeds: [
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true,
			}
		},
		{
			module: "newsfeed",
			position: "bottom_bar",
			config: {
				uni_id: "news_2",
				feeds: [
				],
				showSourceTitle: true,
				showPublishDate: true,
				broadcastNewsFeeds: true,
				broadcastNewsUpdates: true,
			}
		},
		{
		module: "MMM-Remote-Control",
		// uncomment the following line to show the URL of the remote control on the mirror
		position: "bottom_left",
		// you can hide this module afterwards from the remote control itself
		config: {
			uni_id:"",
			customCommand: {},  // Optional, See "Using Custom Commands" below
			showModuleApiMenu: false, // Optional, Enable the Module Controls menu
			secureEndpoints: false, // Optional, See API/README.md
			// uncomment any of the lines below if you"re gonna use it
			// customMenu: "custom_menu.json", // Optional, See "Custom Menu Items" below
			// apiKey: "", // Optional, See API/README.md for details
			// classes: {} // Optional, See "Custom Classes" below
		}
	},
	]
	// END PARSER
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}

		








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
modules:[{'module': 'alert'}, {'module': 'updatenotification', 'position': 'top_bar'}, {'module': 'clock', 'position': 'top_left', 'config': {'displaySeconds': true, 'lat': 48.7823, 'lon': 9.177, 'show': true, 'showSunTimes': true, 'showWeek': true, 'timezone': 'Europe/Stuttgart'}}, {'module': 'clock', 'position': 'top_left', 'config': {'displaySeconds': true, 'lat': -33.8651, 'lon': 151.2099, 'show': false, 'showSunTimes': true, 'showWeek': true, 'timezone': 'Australia/Sydney'}}, {'module': 'calendar', 'header': 'Calendar', 'position': 'top_left', 'config': {'calendars': [{'symbol': 'calendar-check', 'url': 'webcal://i.cal.to/ical/64/baden-wuerttemberg/feiertage/1fed6c7e.ea355af1-04387029.ics'}]}}, {'module': 'weather', 'position': 'top_right', 'config': {'apiKey': '28f8833d6494314b297aba01d98a6f72', 'location': 'Konstanz', 'locationID': '2885679', 'show': true, 'type': 'forecast', 'weatherProvider': 'openweathermap'}}, {'module': 'weather', 'position': 'top_right', 'config': {'apiKey': '28f8833d6494314b297aba01d98a6f72', 'location': 'Stuttgart', 'locationID': '2825297', 'show': false, 'type': 'forecast', 'weatherProvider': 'openweathermap'}}, {'module': 'newsfeed', 'position': 'bottom_bar', 'config': {'feeds': [{'title': 'Reuters', 'url': 'https://www.reutersagency.com/feed/?taxonomy=best-topics&post_type=best'}], 'showSourceTitle': true, 'showPublishDate': true, 'broadcastNewsFeeds': true, 'broadcastNewsUpdates': true}}, {'module': 'newsfeed', 'position': 'bottom_bar', 'config': {'feeds': [{'title': 'Tagesschau Newsticker', 'url': 'https://www.tagesschau.de/xml/rss2/'}], 'showSourceTitle': true, 'showPublishDate': true, 'broadcastNewsFeeds': true, 'broadcastNewsUpdates': true}}, {'module': 'MMM-Remote-Control', 'position': 'bottom_left', 'config': {'customCommand': {}, 'showModuleApiMenu': false, 'secureEndpoints': false}}]
// END PARSER
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}

		








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
modules:[{'module': 'alert'}, {'module': 'updatenotification', 'position': 'top_bar'}, {'uni_id': 'clock_1', 'module': 'clock', 'position': 'top_left', 'config': {'show': True, 'timezone': 'Europe/Berlin', 'displaySeconds': True, 'showWeek': True, 'showSunTimes': True, 'lat': 47.6703, 'lon': 9.251}}, {'uni_id': 'clock_2', 'module': 'clock', 'position': 'top_left', 'config': {'show': False, 'timezone': 'Australia/Canberra', 'displaySeconds': True, 'showWeek': True, 'showSunTimes': False, 'lat': 47.6703, 'lon': 9.251}}, {'uni_id': 'calendar', 'module': 'calendar', 'header': 'Calendar', 'position': 'top_left', 'config': {'calendars': [{'symbol': 'calendar-check', 'url': 'https://www.reihn.de/update_calender/1VItIaXahzWFOgy5PIowr22G/'}, {'symbol': 'calendar-check', 'url': 'webcal://i.cal.to/ical/64/baden-wuerttemberg/feiertage/1fed6c7e.ea355af1-04387029.ics'}]}}, {'uni_id': 'weather_1', 'module': 'weather', 'position': 'top_right', 'config': {'show': True, 'weatherProvider': 'openweathermap', 'type': 'forecast', 'location': 'Konstanz', 'locationID': '2885679', 'apiKey': '28f8833d6494314b297aba01d98a6f72'}}, {'uni_id': 'weather_2', 'module': 'weather', 'position': 'top_right', 'config': {'show': False, 'weatherProvider': 'openweathermap', 'type': 'forecast', 'location': 'Stuttgart', 'locationID': '2825297', 'apiKey': '28f8833d6494314b297aba01d98a6f72'}}, {'uni_id': 'news_1', 'module': 'newsfeed', 'position': 'bottom_bar', 'config': {'feeds': [{'title': 'Reuters Financial', 'url': 'https://ir.thomsonreuters.com/rss/news-releases.xml'}], 'showSourceTitle': True, 'showPublishDate': True, 'broadcastNewsFeeds': True, 'broadcastNewsUpdates': True}}, {'uni_id': 'news_2', 'module': 'newsfeed', 'position': 'bottom_bar', 'config': {'feeds': [{'title': 'Tagesschau Newsticker', 'url': 'https://www.tagesschau.de/newsticker.rdf'}], 'showSourceTitle': True, 'showPublishDate': True, 'broadcastNewsFeeds': True, 'broadcastNewsUpdates': True}}, {'uni_id': 'remote', 'module': 'MMM-Remote-Control', 'position': 'bottom_left', 'config': {'customCommand': {}, 'showModuleApiMenu': False, 'secureEndpoints': False}}]
// END PARSER
};

/*************** DO NOT EDIT THE LINE BELOW ***************/
if (typeof module !== "undefined") {module.exports = config;}

		







var modules = null
var tzStrings = [
  {"label":"(GMT-12:00) International Date Line West","value":"Etc/GMT+12"},
  {"label":"(GMT-11:00) Midway Island, Samoa","value":"Pacific/Midway"},
  {"label":"(GMT-10:00) Hawaii","value":"Pacific/Honolulu"},
  {"label":"(GMT-09:00) Alaska","value":"US/Alaska"},
  {"label":"(GMT-08:00) Pacific Time (US & Canada)","value":"America/Los_Angeles"},
  {"label":"(GMT-08:00) Tijuana, Baja California","value":"America/Tijuana"},
  {"label":"(GMT-07:00) Arizona","value":"US/Arizona"},
  {"label":"(GMT-07:00) Chihuahua, La Paz, Mazatlan","value":"America/Chihuahua"},
  {"label":"(GMT-07:00) Mountain Time (US & Canada)","value":"US/Mountain"},
  {"label":"(GMT-06:00) Central America","value":"America/Managua"},
  {"label":"(GMT-06:00) Central Time (US & Canada)","value":"US/Central"},
  {"label":"(GMT-06:00) Guadalajara, Mexico City, Monterrey","value":"America/Mexico_City"},
  {"label":"(GMT-06:00) Saskatchewan","value":"Canada/Saskatchewan"},
  {"label":"(GMT-05:00) Bogota, Lima, Quito, Rio Branco","value":"America/Bogota"},
  {"label":"(GMT-05:00) Eastern Time (US & Canada)","value":"US/Eastern"},
  {"label":"(GMT-05:00) Indiana (East)","value":"US/East-Indiana"},
  {"label":"(GMT-04:00) Atlantic Time (Canada)","value":"Canada/Atlantic"},
  {"label":"(GMT-04:00) Caracas, La Paz","value":"America/Caracas"},
  {"label":"(GMT-04:00) Manaus","value":"America/Manaus"},
  {"label":"(GMT-04:00) Santiago","value":"America/Santiago"},
  {"label":"(GMT-03:30) Newfoundland","value":"Canada/Newfoundland"},
  {"label":"(GMT-03:00) Brasilia","value":"America/Sao_Paulo"},
  {"label":"(GMT-03:00) Buenos Aires, Georgetown","value":"America/Argentina/Buenos_Aires"},
  {"label":"(GMT-03:00) Greenland","value":"America/Godthab"},
  {"label":"(GMT-03:00) Montevideo","value":"America/Montevideo"},
  {"label":"(GMT-02:00) Mid-Atlantic","value":"America/Noronha"},
  {"label":"(GMT-01:00) Cape Verde Is.","value":"Atlantic/Cape_Verde"},
  {"label":"(GMT-01:00) Azores","value":"Atlantic/Azores"},
  {"label":"(GMT+00:00) Casablanca, Monrovia, Reykjavik","value":"Africa/Casablanca"},
  {"label":"(GMT+00:00) Greenwich Mean Time : Dublin, Edinburgh, Lisbon, London","value":"Etc/Greenwich"},
  {"label":"(GMT+01:00) Amsterdam, Berlin, Bern, Rome, Stockholm, Vienna","value":"Europe/Amsterdam"},
  {"label":"(GMT+01:00) Belgrade, Bratislava, Budapest, Ljubljana, Prague","value":"Europe/Belgrade"},
  {"label":"(GMT+01:00) Brussels, Copenhagen, Madrid, Paris","value":"Europe/Brussels"},
  {"label":"(GMT+01:00) Sarajevo, Skopje, Warsaw, Zagreb","value":"Europe/Sarajevo"},
  {"label":"(GMT+01:00) West Central Africa","value":"Africa/Lagos"},
  {"label":"(GMT+02:00) Amman","value":"Asia/Amman"},
  {"label":"(GMT+02:00) Athens, Bucharest, Istanbul","value":"Europe/Athens"},
  {"label":"(GMT+02:00) Beirut","value":"Asia/Beirut"},
  {"label":"(GMT+02:00) Cairo","value":"Africa/Cairo"},
  {"label":"(GMT+02:00) Harare, Pretoria","value":"Africa/Harare"},
  {"label":"(GMT+02:00) Helsinki, Kyiv, Riga, Sofia, Tallinn, Vilnius","value":"Europe/Helsinki"},
  {"label":"(GMT+02:00) Jerusalem","value":"Asia/Jerusalem"},
  {"label":"(GMT+02:00) Minsk","value":"Europe/Minsk"},
  {"label":"(GMT+02:00) Windhoek","value":"Africa/Windhoek"},
  {"label":"(GMT+03:00) Kuwait, Riyadh, Baghdad","value":"Asia/Kuwait"},
  {"label":"(GMT+03:00) Moscow, St. Petersburg, Volgograd","value":"Europe/Moscow"},
  {"label":"(GMT+03:00) Nairobi","value":"Africa/Nairobi"},
  {"label":"(GMT+03:00) Tbilisi","value":"Asia/Tbilisi"},
  {"label":"(GMT+03:30) Tehran","value":"Asia/Tehran"},
  {"label":"(GMT+04:00) Abu Dhabi, Muscat","value":"Asia/Muscat"},
  {"label":"(GMT+04:00) Baku","value":"Asia/Baku"},
  {"label":"(GMT+04:00) Yerevan","value":"Asia/Yerevan"},
  {"label":"(GMT+04:30) Kabul","value":"Asia/Kabul"},
  {"label":"(GMT+05:00) Yekaterinburg","value":"Asia/Yekaterinburg"},
  {"label":"(GMT+05:00) Islamabad, Karachi, Tashkent","value":"Asia/Karachi"},
  {"label":"(GMT+05:30) Chennai, Kolkata, Mumbai, New Delhi","value":"Asia/Calcutta"},
  {"label":"(GMT+05:30) Sri Jayawardenapura","value":"Asia/Calcutta"},
  {"label":"(GMT+05:45) Kathmandu","value":"Asia/Katmandu"},
  {"label":"(GMT+06:00) Almaty, Novosibirsk","value":"Asia/Almaty"},
  {"label":"(GMT+06:00) Astana, Dhaka","value":"Asia/Dhaka"},
  {"label":"(GMT+06:30) Yangon (Rangoon)","value":"Asia/Rangoon"},
  {"label":"(GMT+07:00) Bangkok, Hanoi, Jakarta","value":"Asia/Bangkok"},
  {"label":"(GMT+07:00) Krasnoyarsk","value":"Asia/Krasnoyarsk"},
  {"label":"(GMT+08:00) Beijing, Chongqing, Hong Kong, Urumqi","value":"Asia/Hong_Kong"},
  {"label":"(GMT+08:00) Kuala Lumpur, Singapore","value":"Asia/Kuala_Lumpur"},
  {"label":"(GMT+08:00) Irkutsk, Ulaan Bataar","value":"Asia/Irkutsk"},
  {"label":"(GMT+08:00) Perth","value":"Australia/Perth"},
  {"label":"(GMT+08:00) Taipei","value":"Asia/Taipei"},
  {"label":"(GMT+09:00) Osaka, Sapporo, Tokyo","value":"Asia/Tokyo"},
  {"label":"(GMT+09:00) Seoul","value":"Asia/Seoul"},
  {"label":"(GMT+09:00) Yakutsk","value":"Asia/Yakutsk"},
  {"label":"(GMT+09:30) Adelaide","value":"Australia/Adelaide"},
  {"label":"(GMT+09:30) Darwin","value":"Australia/Darwin"},
  {"label":"(GMT+10:00) Brisbane","value":"Australia/Brisbane"},
  {"label":"(GMT+10:00) Canberra, Melbourne, Sydney","value":"Australia/Canberra"},
  {"label":"(GMT+10:00) Hobart","value":"Australia/Hobart"},
  {"label":"(GMT+10:00) Guam, Port Moresby","value":"Pacific/Guam"},
  {"label":"(GMT+10:00) Vladivostok","value":"Asia/Vladivostok"},
  {"label":"(GMT+11:00) Magadan, Solomon Is., New Caledonia","value":"Asia/Magadan"},
  {"label":"(GMT+12:00) Auckland, Wellington","value":"Pacific/Auckland"},
  {"label":"(GMT+12:00) Fiji, Kamchatka, Marshall Is.","value":"Pacific/Fiji"},
  {"label":"(GMT+13:00) Nuku'alofa","value":"Pacific/Tongatapu"}
]

var settings = null
  
function init_page() {
  /*
  Init table to sort all future events and fill the table for the first time or after entries
  */
  link_menu()
  load_settings()
}

function save_settings(){
  $.ajax({
    type : "POST",
    cache : false,
    url: "/save_settings/",  
    contentType:"application/json",
    data : JSON.stringify(settings),
    dataType: "json",
    success : function(response){   
      if (typeof response == "object") {
        settings = response
        show_anzeige_menu(first = true)
      } else {
        console.log("shitty response")
      }
    }
  });
}

function load_settings(){
  $.ajax({
    type : "POST",
    cache : false,
    url: "/get_settings/",  
    success : function(response){   
      if (typeof response == "object") {
        settings = response
        show_anzeige_menu(first = true)
        empty_menus()
      } else {
        console.log("shitty response")
      }
    }
  });
}

function link_menu(){
  document.getElementById("anzeige_menu_button").addEventListener("click", function() {
    show_menu("anzeige")
  });
  document.getElementById("message_menu_button").addEventListener("click", function() {
    show_menu("message")
  });  
  document.getElementById("kalender_menu_button").addEventListener("click", function() {
    show_menu("kalender")
  }); 
  document.getElementById("wetter_menu_button").addEventListener("click", function() {
    show_menu("wetter")
  }); 
  document.getElementById("news_menu_button").addEventListener("click", function() {
    show_menu("news")
  }); 
}

function show_menu(this_menu){
  empty_menus()
  if (this_menu=="anzeige"){
    show_anzeige_menu()
  } else if (this_menu=="message"){
    show_message_menu()
  } else if (this_menu=="kalender"){
    show_kalender_menu()
  } else if (this_menu=="wetter"){
    null
  } else if (this_menu=="news"){
    null
  }
}

function empty_menus(){
  document.getElementById("show_module_menu").innerHTML = ""
  document.getElementById("show_message_menu").innerHTML = ""
  document.getElementById("show_kalender_menu").innerHTML = ""
  document.getElementById("show_wetter_menu").innerHTML = ""
  document.getElementById("show_news_menu").innerHTML = ""
}

function show_anzeige_menu(first = false){

  let mod_menu = document.getElementById("show_module_menu")
  let switches = []

  switches.push([settings["clock"]["clock_1"]["show"], "Clock "+ settings["clock"]["clock_1"]["timezone"], "module_2_clock"])
  switches.push([settings["clock"]["clock_2"]["show"], "Clock "+ settings["clock"]["clock_2"]["timezone"], "module_3_clock"])

  switches.push([settings["calendar"]["show"], "Calendar", "module_4_calendar"])

  switches.push([settings["weather"]["weather_1"]["show"], "Weather "+ settings["weather"]["weather_1"]["location"], "module_5_weather"])
  switches.push([settings["weather"]["weather_2"]["show"], "Weather "+ settings["weather"]["weather_2"]["location"], "module_6_weather"])

  switches.push([settings["news"]["news_1"]["show"], "News: "+ settings["news"]["news_1"]["feeds"][0]["title"], "module_7_news"])
  switches.push([settings["news"]["news_2"]["show"], "News: "+ settings["news"]["news_2"]["feeds"][0]["title"], "module_8_news"])

  for (var cur in switches){

    let cur_status = switches[cur][0]
    let cur_title = switches[cur][1]
    let cur_id = switches[cur][2]

    let mod_div = document.createElement("div")
    mod_div.className = "form-check form-switch"

    let mod_switch = document.createElement("input")
    mod_switch.type = "checkbox"
    mod_switch.checked = cur_status
    mod_switch.setAttribute("role", "switch");
    mod_switch.className = "form-check-input"
    mod_switch.id = cur_id+"_checkbox"
    mod_switch.addEventListener("change", function() {
        send_view_change(this.id, this.checked)
    });
    mod_div.appendChild(mod_switch)

    let mod_label = document.createElement("label")
    mod_label.className = "form-check-label"
    mod_label.htmlFor = cur_id+"_checkbox"
    mod_label.innerHTML = cur_title
    mod_div.append(mod_label)

    mod_menu.appendChild(mod_div)

    if (first == true){
      send_view_change(cur_id+"_checkbox", cur_status)
    }
  }
  if (first == true){
    send_view_change("module_9_MMM-Remote-Control_checkbox", false)
  }

  let mod_but = document.createElement("button")
  mod_but.className = "btn btn-secondary"
  mod_but.onclick = function(){save_settings()}
  mod_but.innerHTML = "Als Standard speichern"

  mod_menu.appendChild(mod_but)
}

function send_view_change(id, status){
  var locs = ["module_2_clock", 'module_3_clock', "module_4_calendar", "module_5_weather", "module_6_weather", "module_7_news", "module_8_news"]
  if (id == locs[0]) { 
    settings["clock"]["clock_1"]["show"] = status
  } else if (id == locs[1]) { 
    settings["clock"]["clock_2"]["show"] = status
  } else if (id == locs[2]) { 
    settings["calendar"]["show"] = status
  } else if (id == locs[3]) { 
    settings["weather"]["weather_1"]["show"] = status
  } else if (id == locs[4]) { 
    settings["weather"]["weather_2"]["show"] = status
  } else if (id == locs[5]) { 
    settings["news"]["news_1"]["show"] = status
  } else if (id == locs[6]) { 
    settings["news"]["news_2"]["show"] = status
  } 

  $.ajax({
    type : "POST",
    cache : false,
    url: "/send_view_change/",  
    contentType:"application/json",
    data : JSON.stringify({"id": id, "status": status}),
    dataType: "json",
    success : function(response){   
        console.log("status sent")
    },
    error: function (response) { 
      console.log(response) 
    }
  });
}

function show_message_menu(){
  let mod_menu = document.getElementById("show_message_menu")
  let input_labels = [["Title", "title_name"], ["Message", "mes_name"], ["Timer","timer_name"]]

  for (var cur in input_labels){
    let input_div = document.createElement("div")
    input_div.className = "input-group mb-3"
  
    let label_div = document.createElement("div")
    label_div.className = "input-group-prepend"
    label_div.style = "width:110px;"
    let label_span = document.createElement("span")
    label_span.className = "input-group-text"
    label_span.innerHTML = input_labels[cur][0]
    label_div.appendChild(label_span)
    input_div.appendChild(label_div)
  
    let input_field = document.createElement("input")
    input_field.type = "text"
    input_field.className = "form-control"
    input_field.id = input_labels[cur][1]
    input_div.appendChild(input_field)

    mod_menu.appendChild(input_div)
  }

  let mod_but = document.createElement("button")
  mod_but.className = "btn btn-secondary"
  mod_but.onclick = function(){send_message()}
  mod_but.innerHTML = "Schick es ab !"

  mod_menu.appendChild(mod_but)
}

function send_message() {

  var tit = document.getElementById("title_name").value
  var messi = document.getElementById("mes_name").value
  var timi = document.getElementById("timer_name").value 


  $.ajax({
    type : "POST",
    cache : false,
    url: "/send_message/",  
    contentType:"application/json",
    data : JSON.stringify({"title": tit, "message": messi, "timer":timi }),
    dataType: "json",
    success : function(response){   
        console.log("message sent")
    }
  });
}

function show_kalender_menu(){
  null
}
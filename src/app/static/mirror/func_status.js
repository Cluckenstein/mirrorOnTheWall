var modules = null
var settings = null
  

/* GENERAL */

function init_page() {
  link_menu()
  load_settings()
}


/* SETTINGS */

function load_settings(){
  $.ajax({
    type : "POST",
    cache : false,
    url: "/load_settings/",  
    success : function(response){  
      settings = response 
      setTimeout(function(){
        empty_menus() 
        show_display_menu(first = true)
        }, 1500)
      console.log("settings loaded")
    },
    error: function(){
      console.log("shitty response")
    }
  });
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
      settings = response 
      setTimeout(function(){
        empty_menus() 
        show_display_menu(first = true)
        }, 1500)
      console.log("settings saved")
    },
    error: function(){
      console.log("shitty response")
    }
  });
}


function link_menu(){
  document.getElementById("display_menu_button").addEventListener("click", function() {
    show_menu("display")
  });
  document.getElementById("clock_menu_button").addEventListener("click", function() {
    show_menu("clock")
  });
  document.getElementById("message_menu_button").addEventListener("click", function() {
    show_menu("message")
  });  
  document.getElementById("calendar_menu_button").addEventListener("click", function() {
    show_menu("calendar")
  }); 
  document.getElementById("weather_menu_button").addEventListener("click", function() {
    show_menu("weather")
  }); 
  document.getElementById("news_menu_button").addEventListener("click", function() {
    show_menu("news")
  }); 
}


function show_menu(this_menu){
  empty_menus()
  if (this_menu=="display"){
    show_display_menu()
  } else if (this_menu=="clock"){
    show_clock_menu()
  } else if (this_menu=="message"){
    show_message_menu()
  } else if (this_menu=="calendar"){
    show_calendar_menu()
  } else if (this_menu=="weather"){
    show_weather_menu()
  } else if (this_menu=="news"){
    show_news_menu()
  }
}


function empty_menus(){
  document.getElementById("show_module_menu").innerHTML = ""
  document.getElementById("show_clock_menu").innerHTML = ""
  document.getElementById("show_message_menu").innerHTML = ""
  document.getElementById("show_calendar_menu").innerHTML = ""
  document.getElementById("show_weather_menu").innerHTML = ""
  document.getElementById("show_news_menu").innerHTML = ""
}


/* DISPLAY */

function show_display_menu(first = false){

  let mod_menu = document.getElementById("show_module_menu")
  let switches = []

  switches.push([settings["clock"]["clock_1"]["show"], "Clock "+ settings["clock"]["clock_1"]["timezone"].replace(/\//g,", ").replace(/_/g," "), "module_2_clock"])
  switches.push([settings["clock"]["clock_2"]["show"], "Clock "+ settings["clock"]["clock_2"]["timezone"].replace(/\//g,", ").replace(/_/g," "), "module_3_clock"])

  switches.push([settings["calendar"]["show"], "Calendar", "module_4_calendar"])

  switches.push([settings["weather"]["weather_1"]["show"], "Weather "+ settings["weather"]["weather_1"]["location"], "module_5_weather"])
  switches.push([settings["weather"]["weather_2"]["show"], "Weather "+ settings["weather"]["weather_2"]["location"], "module_6_weather"])

  switches.push([settings["news"]["news_1"]["show"], "News: "+ settings["news"]["news_1"]["feeds"][0]["title"], "module_7_news"])
  switches.push([settings["news"]["news_2"]["show"], "News: "+ settings["news"]["news_2"]["feeds"][0]["title"], "module_8_news"])

  for (let cur in switches){

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
        send_display_change(this.id, this.checked)
    });
    mod_div.appendChild(mod_switch)

    let mod_label = document.createElement("label")
    mod_label.className = "form-check-label"
    mod_label.htmlFor = cur_id+"_checkbox"
    mod_label.innerHTML = cur_title
    mod_div.append(mod_label)

    mod_menu.appendChild(mod_div)

    if (first == true){
      send_display_change(cur_id+"_checkbox", cur_status)
    }
  }
  if (first == true){
    send_display_change("module_9_MMM-Remote-Control_checkbox", false)
  }

  let mod_but = document.createElement("button")
  mod_but.className = "btn btn-secondary"
  mod_but.onclick = function(){save_settings()}
  mod_but.innerHTML = "Save as Default"

  mod_menu.appendChild(mod_but)
}


function send_display_change(id, status){
  let locs = ["module_2_clock_checkbox", "module_3_clock_checkbox", "module_4_calendar_checkbox", "module_5_weather_checkbox", "module_6_weather_checkbox", "module_7_news_checkbox", "module_8_news_checkbox"]
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
    url: "/send_display_change/",  
    contentType:"application/json",
    data : JSON.stringify({"id": id, "status": status}),
    dataType: "json",
    success : function(){

      console.log("status sent")
    },
    error: function() { 
      console.log("shitty response") 
    }
  });
}


/* CLOCK */

function show_clock_menu(){

  let mod_menu = document.getElementById("show_clock_menu")

  for (let cur_clock in settings["clock"]){
    if (cur_clock!="position"){
      for (let set of ["showSunTimes","displaySeconds","showWeek"]){
  
        let mod_div = document.createElement("div")
        mod_div.className = "form-check form-switch"

        let mod_switch = document.createElement("input")
        mod_switch.type = "checkbox"
        mod_switch.checked = settings["clock"][cur_clock][set]
        mod_switch.setAttribute("role", "switch");
        mod_switch.className = "form-check-input"
        mod_switch.id = cur_clock+"_"+set+"_checkbox"
        mod_switch.addEventListener("change", function() {send_clock_change(this.id, this.checked)
        });
        mod_div.appendChild(mod_switch)

        let mod_label = document.createElement("label")
        mod_label.className = "form-check-label"
        mod_label.htmlFor = cur_clock+"_"+set+"_checkbox"
        if (set=="showSunTimes"){
          mod_label.innerHTML = "Sun-Times"
        }
        else if (set=="displaySeconds"){
          mod_label.innerHTML = "Seconds"
        }
        else if (set=="showWeek"){
          mod_label.innerHTML = "Week"
        }
        else {
          mod_label.innerHTML = set
        }                 
        mod_div.append(mod_label)
        mod_menu.appendChild(mod_div)
      }

      let drop_div = document.createElement("div")
      drop_div.className = "dropdown"

      let drop_button = document.createElement("a")
      drop_button.className = "btn btn-secondary dropdown-toggle"
      drop_button.setAttribute("role","button")
      drop_button.id = cur_clock+"_dropbutton"
      drop_button.href = "#"
      drop_button.setAttribute("data-toggle", "dropdown")
      drop_button.setAttribute("aria-haspopup", "true")
      drop_button.setAttribute("aria-expanded", "false")
      drop_button.innerHTML = settings["clock"][cur_clock]["timezone"].replace(/\//g,", ").replace(/_/g," ")
      drop_div.appendChild(drop_button)

      let drop_menu_div = document.createElement("div")
      drop_menu_div.className = "dropdown-menu"
      drop_menu_div.setAttribute("aria-labelledby", cur_clock+"_dropbutton")

      for (let tz in timezones){
        let drop_point = document.createElement("a")
        drop_point.className = "dropdown-item"
        drop_point.innerHTML = tz.replace(/\//g,", ").replace(/_/g," ")
        drop_point.href = "#"
        drop_point.id = cur_clock+"_"+tz.replace(/_/g,"-")+"_dropbutton"        
        drop_point.addEventListener("click", function() {
          change_tz_button(this.innerHTML, this.id)
        })   
        drop_point.addEventListener("click", function() {        
          send_tz_change(this.id)
        });
        drop_menu_div.appendChild(drop_point)
      }

      drop_div.appendChild(drop_menu_div)
      mod_menu.appendChild(drop_div)

    }
  }

}


function send_clock_change(id, status){
  let idsplit = id.split("_")
  let clock = idsplit[0]+"_"+idsplit[1]
  let mod = idsplit[2]

  settings["clock"][clock][mod] = status

  $.ajax({
    type : "POST",
    cache : false,
    url: "/send_clock_change/",  
    contentType:"application/json",
    data : JSON.stringify(settings),
    dataType: "json",
    success : function(response){
      settings = response  
      setTimeout(function(){
        empty_menus() 
        show_clock_menu()
        }, 1500)
      console.log("status sent")
    },
    error: function(){
      console.log("shitty response")
    }
  });
}


function change_tz_button(string, button){
  let buttonsplit = button.split("_")
  let cur_but = document.getElementById(buttonsplit[0]+"_"+buttonsplit[1]+"_"+buttonsplit[3])
  cur_but.innerHTML = string
}


function send_tz_change(id){
  let idsplit = id.split("_")
  let clock = idsplit[0]+"_"+idsplit[1]
  let tz = idsplit[2].replace(/-/g,"_")
  
  settings["clock"][clock]["timezone"] = tz
  settings["clock"][clock]["lat"] = timezones[tz]["lat"]
  settings["clock"][clock]["lon"] = timezones[tz]["lon"]

  $.ajax({
    type : "POST",
    cache : false,
    url: "/send_tz_change/",  
    contentType:"application/json",
    data : JSON.stringify(settings),
    dataType: "json",
    success : function(response){ 
      settings = response  
      setTimeout(function(){
        empty_menus() 
        show_clock_menu()
        }, 1500)
      console.log("timezone sent")
    },
    error: function(){
      console.log("shitty response")
    }
  });
}

/* MESSAGE */

function show_message_menu(){

  let mod_menu = document.getElementById("show_message_menu")
  let input_labels = [["Title", "title_name"], ["Message", "message_name"], ["Timer","timer_name"]]

  for (let cur in input_labels){
    let input_div = document.createElement("div")
    input_div.className = "input-group mb-3"
  
    let label_div = document.createElement("div")
    label_div.className = "input-group-prepend"
    label_div.style = "margin-right:10px"

    let label_span = document.createElement("span")
    label_span.className = "input-group-text"
    label_span.innerHTML = input_labels[cur][0]
    label_span.style = "width:90px"

    label_div.appendChild(label_span)
    input_div.appendChild(label_div)
  
    var input_field = document.createElement("input")
    input_field.type = "text"
    input_field.className = "form-control"
    input_field.id = input_labels[cur][1]
    if (input_labels[cur][0] == "Timer"){
      input_field.placeholder = "3 Seconds"
    }

    input_div.appendChild(input_field)
    mod_menu.appendChild(input_div)
  }

  let mod_but = document.createElement("button")
  mod_but.className = "btn btn-secondary"
  mod_but.onclick = function(){send_message()}
  mod_but.innerHTML = "Send it"

  mod_menu.appendChild(mod_but)
}


function send_message() {

  let title = document.getElementById("title_name").value
  let message = document.getElementById("message_name").value
  let timer = document.getElementById("timer_name").value 

  $.ajax({
    type : "POST",
    cache : false,
    url: "/send_message/",  
    contentType:"application/json",
    data : JSON.stringify({"title": title, "message": message, "timer": timer}),
    dataType: "json",
    success : function(){   
      setTimeout(function(){
        empty_menus() 
        show_message_menu()
        }, 1500)
      console.log("message sent")
    },
    error: function(){
      console.log("shitty response")
    }
  });
}


/* CALENDAR */

function show_calendar_menu(){

  let mod_menu = document.getElementById("show_calendar_menu")
  
  let counter = 0
  for (let cal in settings["calendar"]["calendars"]){

    let input_div = document.createElement("div")
    input_div.className = "input-group mb-3"

    let label_div = document.createElement("div")
    label_div.className = "input-group-prepend"
    label_div.style = "margin-right:10px"

    let label_span = document.createElement("span")
    label_span.className = "input-group-text"
    label_span.innerHTML = "URL"
    label_span.style = "width:55px"

    label_div.appendChild(label_span)
    input_div.appendChild(label_div)

    let url_field = document.createElement("input")
    url_field.readOnly = true
    url_field.className = "form-control"
    url_field.placeholder = settings["calendar"]["calendars"][cal]["url"]
    url_field.id = "cal_"+counter.toString()
    url_field.maxLength = "1000px"
    url_field.style = "margin-right:10px"

    let but_div = document.createElement("div")
    but_div.className = "input-group-append"

    let but_del = document.createElement("button")
    but_del.type = "button"
    but_del.onclick = function(){delete_cal()}
    but_del.className = "btn btn-secondary"
    but_del.innerHTML = "Delete"
    but_del.style = "width:70px" 

    but_div.appendChild(but_del)
    
    input_div.appendChild(url_field)
    input_div.appendChild(but_div)
    mod_menu.appendChild(input_div)
    
    counter = counter + 1
  }

  let input_div = document.createElement("div")
  input_div.className = "input-group mb-3"

  let label_div = document.createElement("div")
  label_div.className = "input-group-prepend"
  label_div.style = "margin-right:10px"

  let label_span = document.createElement("span")
  label_span.className = "input-group-text"
  label_span.innerHTML = "New"
  label_span.style = "width:55px"

  label_div.appendChild(label_span)
  input_div.appendChild(label_div)

  var url_input_field = document.createElement("input")
  url_input_field.type = "text"
  url_input_field.className = "form-control"
  url_input_field.placeholder = "URL"
  url_input_field.id = "new_calendar_url"
  url_input_field.style = "margin-right:10px"  

  let but_div = document.createElement("div")
  but_div.className = "input-group-append"

  let but_add = document.createElement("button")
  but_add.type = "button"
  but_add.onclick = function(){add_cal()}
  but_add.className = "btn btn-secondary"
  but_add.innerHTML = "Add"
  but_add.style = "width:70px" 

  but_div.appendChild(but_add)
  
  input_div.appendChild(url_input_field)
  input_div.appendChild(but_div)
  mod_menu.appendChild(input_div)
}


function delete_cal() {

  counter = 0
  id = "cal_"+counter.toString()
  met = false
  let url = ""
  while (met==false){
    url = document.getElementById(id).placeholder
    if (url!=""){
      met = true
    }
    else{
      counter = counter + 1
    }
  }

  $.ajax({
    type : "POST",
    cache : false,
    url: "/delete_cal/",  
    contentType:"application/json",
    data : JSON.stringify({"url": url}),
    dataType: "json",
    success : function(response){
      settings = response  
      setTimeout(function(){
        empty_menus() 
        show_calendar_menu()
        }, 1500)
      console.log("calendar deleted")
    },
    error: function() {
      console.log("shitty response") 
    }
  });
}


function add_cal() {

  id = "new_calendar_url"
  let new_url = document.getElementById(id).value

  $.ajax({
    type : "POST",
    cache : false,
    url: "/add_cal/",  
    contentType:"application/json",
    data : JSON.stringify({"url": new_url}),
    dataType: "json",
    success: function(response){
      settings = response   
      setTimeout(function(){
        empty_menus() 
        show_calendar_menu()
        }, 1500)
      console.log("calendar added")
    },
    error: function() {
      console.log("shitty response") 
    }
  });
}


/* WEATHER */

function show_weather_menu(){

  let mod_menu = document.getElementById("show_weather_menu")

  for (let cur_weather in settings["weather"]){
    if (cur_weather!="position"){

      let input_div = document.createElement("div")
      input_div.className = "input-group mb-3"

      let label_div = document.createElement("div")
      label_div.className = "input-group-prepend"
      label_div.style = "margin-right:10px"

      let label_span = document.createElement("span")
      label_span.className = "input-group-text"
      label_span.innerHTML = "Location"
      label_span.style = "width:85px"

      label_div.appendChild(label_span)
      input_div.appendChild(label_div)

      let drop_div = document.createElement("div")
      drop_div.className = "dropdown"

      let drop_button = document.createElement("a")
      drop_button.className = "btn btn-secondary dropdown-toggle"
      drop_button.setAttribute("role","button")
      drop_button.id = cur_weather+"_dropbutton"
      drop_button.href = "#"
      drop_button.setAttribute("data-toggle", "dropdown")
      drop_button.setAttribute("aria-haspopup", "true")
      drop_button.setAttribute("aria-expanded", "false")
      drop_button.innerHTML = settings["weather"][cur_weather]["location"]

      drop_div.appendChild(drop_button)

      let drop_menu_div = document.createElement("div")
      drop_menu_div.className = "dropdown-menu"
      drop_menu_div.setAttribute("aria-labelledby", cur_weather+"_dropbutton")

      for (let wl in weatherlocs){
        let drop_point = document.createElement("a")
        drop_point.className = "dropdown-item"
        drop_point.innerHTML = wl
        drop_point.href = "#"
        drop_point.id = cur_weather+"_"+wl+"_dropbutton"        
        drop_point.addEventListener("click", function() {
          change_wl_button(this.innerHTML, this.id)
        })   
        drop_point.addEventListener("click", function() {        
          send_wl_change(this.id)
        });
        drop_menu_div.appendChild(drop_point)
      }

      drop_div.appendChild(drop_menu_div)
      input_div.appendChild(drop_div)
      mod_menu.appendChild(input_div)
    }
  }

  let input_div = document.createElement("div")
  input_div.className = "input-group mb-3"

  let label_div = document.createElement("div")
  label_div.className = "input-group-prepend"
  label_div.style = "margin-right:10px"

  let label_span = document.createElement("span")
  label_span.className = "input-group-text"
  label_span.innerHTML = "New"
  label_span.style = "width:85px"

  label_div.appendChild(label_span)
  input_div.appendChild(label_div)

  var loc_input_field = document.createElement("input")
  loc_input_field.type = "text"
  loc_input_field.className = "form-control"
  loc_input_field.placeholder = "Location"
  loc_input_field.id = "new_loc"
  loc_input_field.style = "margin-right:10px"

  var locid_input_field = document.createElement("input")
  locid_input_field.type = "text"
  locid_input_field.className = "form-control"
  locid_input_field.placeholder = "Location ID"
  locid_input_field.id = "new_locid"
  locid_input_field.style = "margin-right:10px"  

  let but_div = document.createElement("div")
  but_div.className = "input-group-append"

  let but_add = document.createElement("button")
  but_add.type = "button"
  but_add.onclick = function(){add_wl()}
  but_add.className = "btn btn-secondary"
  but_add.innerHTML = "Add"
  but_add.style = "width:70px" 

  but_div.appendChild(but_add)
  
  input_div.appendChild(loc_input_field)
  input_div.appendChild(locid_input_field)
  input_div.appendChild(but_div)
  mod_menu.appendChild(input_div)

}


function change_wl_button(string, button){
  let buttonsplit = button.split("_")
  let cur_but = document.getElementById(buttonsplit[0]+"_"+buttonsplit[1]+"_"+buttonsplit[3])
  cur_but.innerHTML = string
}


function send_wl_change(id){
  let idsplit = id.split("_")
  let weather = idsplit[0]+"_"+idsplit[1]
  let wl = idsplit[2]
  
  settings["weather"][weather]["location"] = wl
  settings["weather"][weather]["locationID"] = weatherlocs[wl]["locationID"]

  $.ajax({
    type : "POST",
    cache : false,
    url: "/send_wl_change/",  
    contentType:"application/json",
    data : JSON.stringify(settings),
    dataType: "json",
    success : function(response){ 
      settings = response  
      setTimeout(function(){
        empty_menus() 
        show_weather_menu()
        }, 1500)
      console.log("weatherloc sent")
    },
    error: function(){
      console.log("shitty response")
    }
  });
}


function add_wl() {

  loc = "new_loc"
  locid = "new_locid"
  let new_loc = document.getElementById(loc).value
  let new_locid = document.getElementById(locid).value

  weatherlocs[new_loc] = {"locationID": new_locid}

  setTimeout(function(){
    empty_menus() 
    show_weather_menu()
    }, 1500)
   console.log("location added")

}


/* NEWSFEED */

function show_news_menu(){

  let mod_menu = document.getElementById("show_news_menu")

  for (let cur_news in settings["news"]){
    if (cur_news!="position"){

      let input_div = document.createElement("div")
      input_div.className = "input-group mb-3"

      let label_div = document.createElement("div")
      label_div.className = "input-group-prepend"
      label_div.style = "margin-right:10px"

      let label_span = document.createElement("span")
      label_span.className = "input-group-text"
      label_span.innerHTML = "News"
      label_span.style = "width:60px"

      label_div.appendChild(label_span)
      input_div.appendChild(label_div)

      var title_input_field = document.createElement("input")
      title_input_field.type = "text"
      title_input_field.className = "form-control"
      title_input_field .placeholder = settings["news"][cur_news]["feeds"][0]["title"]
      title_input_field.id = cur_news+"_title"
      title_input_field.style = "margin-right:10px" 

      var url_input_field = document.createElement("input")
      url_input_field.type = "text"
      url_input_field.className = "form-control"
      url_input_field.placeholder = settings["news"][cur_news]["feeds"][0]["url"]
      url_input_field.id = cur_news+"_url"
      url_input_field.style = "margin-right:10px"  

      let but_div = document.createElement("div")
      but_div.className = "input-group-append"

      let but_add = document.createElement("button")
      but_add.type = "button"
      but_add.onclick = function(){send_news_change(url_input_field.id)}
      but_add.className = "btn btn-secondary"
      but_add.innerHTML = "Change"
      but_add.style = "width:80px" 

      but_div.appendChild(but_add)

      input_div.appendChild(title_input_field)
      input_div.appendChild(url_input_field)
      input_div.appendChild(but_div)
      mod_menu.appendChild(input_div)
    }    
  }
}

function send_news_change(id){
  let idsplit = id.split("_")
  let new_id = idsplit[0]+"_"+idsplit[1]
  let new_url = document.getElementById(new_id+"_url").value
  let new_title = document.getElementById(new_id+"_title").value
  
  settings["news"][new_id]["feeds"][0]["url"] = new_url
  settings["news"][new_id]["feeds"][0]["title"] = new_title

  $.ajax({
    type : "POST",
    cache : false,
    url: "/send_news_change/",  
    contentType:"application/json",
    data : JSON.stringify(settings),
    dataType: "json",
    success : function(response){ 
      settings = response  
      setTimeout(function(){
        empty_menus() 
        show_news_menu()
        }, 1500)
      console.log("news changed")
    },
    error: function(){
      console.log("shitty response")
    }
  });
}

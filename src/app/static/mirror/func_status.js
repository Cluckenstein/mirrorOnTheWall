var modules = null
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
        setTimeout(function(){
          empty_menus() 
          show_anzeige_menu(first = true)
          }, 1500);
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
        setTimeout(function(){
          show_anzeige_menu(first = true)
          empty_menus() }, 1500);
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
  document.getElementById("clock_menu_button").addEventListener("click", function() {
    show_menu("clock")
  });
  document.getElementById("message_menu_button").addEventListener("click", function() {
    show_menu("message")
  });  
  document.getElementById("calendar_menu_button").addEventListener("click", function() {
    show_menu("calendar")
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
  } else if (this_menu=="clock"){
    show_clock_menu()
  } else if (this_menu=="message"){
    show_message_menu()
  } else if (this_menu=="calendar"){
    show_calendar_menu()
  } else if (this_menu=="wetter"){
    null
  } else if (this_menu=="news"){
    null
  }
}

function empty_menus(){
  document.getElementById("show_module_menu").innerHTML = ""
  document.getElementById("show_message_menu").innerHTML = ""
  document.getElementById("show_calendar_menu").innerHTML = ""
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
  mod_but.innerHTML = "Save as default"

  mod_menu.appendChild(mod_but)
}

function send_view_change(id, status){
  var locs = ["module_2_clock_checkbox", "module_3_clock_checkbox", "module_4_calendar_checkbox", "module_5_weather_checkbox", "module_6_weather_checkbox", "module_7_newsfeed_checkbox", "module_8_newsfeed_checkbox"]
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
      console.log('no error to see here') 
    }
  });
}

function show_clock_menu(){

  let mod_menu = document.getElementById("show_clock_menu")
  let switches = []

  for (var cur_clock in settings["clock"]){
    console.log(cur_clock)
    if (cur_clock!="position"){
      for (var set of ["showSunTimes","displaySeconds","showWeek"]){
  
        let mod_div = document.createElement("div")
        mod_div.className = "form-check form-switch"
        let mod_switch = document.createElement("input")
        mod_switch.type = "checkbox"
        mod_switch.checked = settings["clock"][cur_clock][set]
        mod_switch.setAttribute("role", "switch");
        mod_switch.className = "form-check-input"
        mod_switch.id = cur_clock+set+"_checkbox"
        mod_switch.addEventListener("change", function() {
            console.log(this.id, this.checked)
        });
        mod_div.appendChild(mod_switch)

        let mod_label = document.createElement("label")
        mod_label.className = "form-check-label"
        mod_label.htmlFor = cur_clock+set+"_checkbox"
        mod_label.innerHTML = set
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
      drop_button.innerHTML = settings["clock"][cur_clock]["timezone"]
      drop_div.appendChild(drop_button)

      let drop_menu_div = document.createElement("div")
      drop_menu_div.className = "dropdown-menu"
      drop_menu_div.setAttribute("aria-labelledby", cur_clock+"_dropbutton")

      for (var tz of time_zones){
        let drop_point = document.createElement("a")
        drop_point.className = "dropdown-item"
        drop_point.innerHTML = tz
        drop_point.href = "#"
        drop_point.id = cur_clock+"_dropbutton?"+time_zones.indexOf(tz)
        drop_point.addEventListener("click", function() {
          change_drop_button(this.innerHTML, this.id)
      });
        drop_menu_div.appendChild(drop_point)
      }


      drop_div.appendChild(drop_menu_div)
      mod_menu.appendChild(drop_div)

    }
  }

}

function change_drop_button(string, button){
  let cur_but = document.getElementById(button.slice(0,button.indexOf("?")))
  cur_but.innerHTML = string
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

function show_calendar_menu(){
  let mod_menu = document.getElementById("show_calendar_menu")

  for (var cal in settings["calendar"]["calendars"]){
    let input_div = document.createElement("div")
    input_div.className = "input-group mb-3"
    let label_div = document.createElement("div")
    label_div.className = "input-group-prepend"
    let label_span = document.createElement("span")
    label_span.className = "input-group-text"
    label_span.innerHTML = "URL"
    label_div.appendChild(label_span)
    let url_span = document.createElement("input")
    url_span.readOnly = true
    url_span.className = "form-control"
    url_span.placeholder = settings["calendar"]["calendars"][cal]["url"]
    let but_div = document.createElement("div")
    but_div.className = "input-group-append"
    let but_del = document.createElement("button")
    but_del.id = cal
    but_del.type = "button"
    but_del.onclick = function(){console.log("entferen bitte") // TODO
  console.log(this.id)}
    but_del.className = "btn btn-outline-secondary"
    but_del.innerHTML = "DELETE"
    but_div.appendChild(but_del)
    input_div.appendChild(label_div)
    input_div.appendChild(url_span)
    input_div.appendChild(but_div)
    mod_menu.appendChild(input_div)
  }
  let input_div = document.createElement("div")
  input_div.className = "input-group mb-3"
  let label_div = document.createElement("div")
  label_div.className = "input-group-prepend"
  let label_span = document.createElement("span")
  label_span.className = "input-group-text"
  label_span.innerHTML = "URL"
  label_div.appendChild(label_span)
  let url_span = document.createElement("input")
  url_span.className = "form-control"
  let but_div = document.createElement("div")
  but_div.className = "input-group-append"
  let but_del = document.createElement("button")
  but_del.id = 'new_calendar_url'
  but_del.type = "button"
  but_del.onclick = function(){console.log("hinzufugen bitte") // TODO
console.log(this.id)}
  but_del.className = "btn btn-outline-secondary"
  but_del.innerHTML = "ADD"
  but_div.appendChild(but_del)
  input_div.appendChild(label_div)
  input_div.appendChild(url_span)
  input_div.appendChild(but_div)
  mod_menu.appendChild(input_div)
}
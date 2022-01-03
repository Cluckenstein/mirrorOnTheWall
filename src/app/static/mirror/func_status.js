var modules = null

  
function init_page() {
  /*
  Init table to sort all future events and fill the table for the first time or after entries
  */
  link_menu()
}

function link_menu(){
  document.getElementById("anzeige_menu_button").addEventListener("click", function() {
    show_menu('anzeige')
  });
  document.getElementById("message_menu_button").addEventListener("click", function() {
    show_menu('message')
  });  
  document.getElementById("kalender_menu_button").addEventListener("click", function() {
    show_menu('kalender')
  }); 
  document.getElementById("wetter_menu_button").addEventListener("click", function() {
    show_menu('wetter')
  }); 
  document.getElementById("news_menu_button").addEventListener("click", function() {
    show_menu('news')
  }); 
}

function show_menu(this_menu){
  empty_menus()
  if (this_menu=='anzeige'){
    show_anzeige_menu()
  } else if (this_menu=='message'){
    show_message_menu()
  } else if (this_menu=='kalender'){
    show_kalender_menu()
  } else if (this_menu=='wetter'){
    null
  } else if (this_menu=='news'){
    null
  }
}

function empty_menus(){
  document.getElementById('show_module_menu').innerHTML = ''
  document.getElementById('show_message_menu').innerHTML = ''
  document.getElementById('show_kalender_menu').innerHTML = ''
  document.getElementById('show_wetter_menu').innerHTML = ''
  document.getElementById('show_news_menu').innerHTML = ''
}

function show_anzeige_menu(){
  $.ajax({
    type : 'POST',
    cache : false,
    url: "/get_modules/",  
    success : function(response){   
      if (typeof response == 'object') {
        modules = response
        fill_modules()
      } else {
        console.log('shitty response')
      }
    }
  });
}

function fill_modules(){
  let mod_menu = document.getElementById('show_module_menu')

  for (var mod in modules){
    for (var ident in modules[mod]){
      let mod_div = document.createElement('div')
      mod_div.className = "form-check form-switch"

      let mod_switch = document.createElement('input')
      mod_switch.type = "checkbox"
      mod_switch.checked = !modules[mod][ident]['hidden']
      mod_switch.setAttribute("role", "switch");
      mod_switch.className = "form-check-input"
      mod_switch.id = modules[mod][ident]['identifier']+"_checkbox"
      mod_switch.addEventListener('change', function() {
          send_view_change(this.id, this.checked)
      });
      mod_div.appendChild(mod_switch)

      let mod_label = document.createElement('label')
      mod_label.className = "form-check-label"
      mod_label.htmlFor = modules[mod][ident]['identifier']+"_checkbox"
      mod_label.innerHTML = modules[mod][ident]['switch_name']
      mod_div.append(mod_label)

      mod_menu.appendChild(mod_div)
    } 
  }

  let mod_but = document.createElement('button')
  mod_but.className = "btn btn-secondary"
  mod_but.onclick = function(){save_settings()}
  mod_but.innerHTML = 'Als Standard speichern'

  mod_menu.appendChild(mod_but)
}

function save_settings(){
  null
}

function send_view_change(id, status){
  $.ajax({
    type : 'POST',
    cache : false,
    url: "/send_view_change/",  
    contentType:"application/json",
    data : JSON.stringify({'id': id, 'status': status}),
    dataType: 'json',
    success : function(response){   
        console.log('status sent')
    },
    error: function (response) { 
      console.log(response) 
    }
  });
}

function show_message_menu(){
  let mod_menu = document.getElementById('show_message_menu')
  let input_labels = [['Titel', 'title_name'], ['Nachricht', 'mes_name'], ['Timer','timer_name']]

  for (var cur in input_labels){
    let input_div = document.createElement('div')
    input_div.className = "input-group mb-3"
  
    let label_div = document.createElement('div')
    label_div.className = "input-group-prepend"
    label_div.style = "width:110px;"
    let label_span = document.createElement('span')
    label_span.className = "input-group-text"
    label_span.innerHTML = input_labels[cur][0]
    label_div.appendChild(label_span)
    input_div.appendChild(label_div)
  
    let input_field = document.createElement('input')
    input_field.type = 'text'
    input_field.className = 'form-control'
    input_field.id = input_labels[cur][1]
    input_div.appendChild(input_field)

    mod_menu.appendChild(input_div)
  }

  let mod_but = document.createElement('button')
  mod_but.className = "btn btn-secondary"
  mod_but.onclick = function(){send_message()}
  mod_but.innerHTML = 'Schick es ab !'

  mod_menu.appendChild(mod_but)
}

function send_message() {

  var tit = document.getElementById('title_name').value
  var messi = document.getElementById('mes_name').value
  var timi = document.getElementById('timer_name').value 


  $.ajax({
    type : 'POST',
    cache : false,
    url: "/send_message/",  
    contentType:"application/json",
    data : JSON.stringify({'title': tit, 'message': messi, 'timer':timi }),
    dataType: 'json',
    success : function(response){   
        console.log('message sent')
    }
  });
}

function show_kalender_menu(){
  null
}
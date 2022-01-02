var modules = null
  
function init_page() {
  /*
  Init table to sort all future events and fill the table for the first time or after entries
  */
    fill_table() // if an entry is made keep the oldd sorting  
    message_sender()
    get_modules()
}

function get_modules(){
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
    error: function () { document.getElementById(id).checked = !document.getElementById(id).checked }
  });
}

function message_sender() { 

  let but = document.getElementById('button_not')
  var but_in = document.createElement('button')
  but_in.className = "btn btn-secondary"
  but_in.margin = "7px"
  but_in.onclick = function(){send_message()}
  but_in.innerHTML = 'Just send it!'
  but.appendChild(but_in)

  let title = document.getElementById('title_not');
  var name_in = document.createElement("input")
  name_in.type = 'text'
  name_in.id = 'title_name'
  name_in.value = '' 
  title.appendChild(name_in)  
  
  let message = document.getElementById('mes_not');
  var mes_in = document.createElement("input")
  mes_in.type = 'text'
  mes_in.id = 'mes_name'
  mes_in.value = '' 
  message.appendChild(mes_in)   

  let timer = document.getElementById('timer_not');
  var timer_in = document.createElement("input")
  timer_in.type = 'text'
  timer_in.id = 'timer_name'
  timer_in.value = '' 
  timer.appendChild(timer_in)   

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

function fill_table(){

  /*
  Fills the table front end according to the current sorting 
  */

  document.getElementById('status_table').innerHTML = '';
  const table_html = document.getElementById("status_table");

  for (var row of tbl) { 
      let html_row = table_html.insertRow(); //init new row 

      let name = html_row.insertCell(0); 
      name.innerHTML = String(row['name']);

      let config = html_row.insertCell(1); 
      let conf = ''
      for (var [na, val] of Object.entries(row.config)){ 
        conf += String(na)+' : '+String(val)+'<br>'
      }
      config.innerHTML = conf;
  
  }
}

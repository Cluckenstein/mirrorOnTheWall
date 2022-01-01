
  
function init_page() {
  /*
  Init table to sort all future events and fill the table for the first time or after entries
  */
    fill_table() // if an entry is made keep the oldd sorting  
    message_sender()
}

function message_sender() { 

  let but = document.getElementById('button_not')
  var but_in = document.createElement('button')
  but_in.className = "btn btn-secondary"
  but_in.margin = "7px"
  but_in.onclick = send_message()
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

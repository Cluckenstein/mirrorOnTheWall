var seper = false //seperator between weeks if ordered  for date
var orderer = 'date' //order type 
var tbl_archiv = null //if date range save all events here
var trainers = ['KR', 'SB', 'MO', 'CW', 'JE', 'FH', 'MR'] //list of trainers
const front_cols = 3 //cols before trainers in frontend
const back_cols = 1 //cols after trainers in frontend 
const db_front_cols = 2 //cols before trainers in db 
var id_index = 9 //index if training_id in data 
var tbl_vergl = {}; //init compare dict 
var changer =''
var cols_status = 4;
var cur_ath = {}

//tbl is the main global var which is always the one displayed 

  
function init_table(first = false) {
  /*
  Init table to sort all future events and fill the table for the first time or after entries
  */

    fill_table(first) // if an entry is made keep the oldd sorting  
}

function fill_table(first){

  /*
  Fills the table front end according to the current sorting 
  */

//   var temp_tbl = []
//   var now = Math.floor(Date.now() / 1000)
//   for (var i = 0; i<tbl.length; i++){ // no future events are shown 
//         if (now > tbl[i][1]) {
//             temp_tbl.push(tbl[i])
//         }
//   }

  document.getElementById('status_table').innerHTML = '';
  const table_html = document.getElementById("status_table");


  let html_row = table_html.insertRow();
  
  let trai = html_row.insertCell(0);
  var trai_in = document.createElement("input")
  trai_in.type = 'text'
  trai_in.id = 'input_name'
  trai_in.value = '' 
  trai.appendChild(trai_in)   

  let stat_date = html_row.insertCell(1);
  var stat_date_in = document.createElement("input")
  stat_date_in.type = 'date'
  stat_date_in.id = 'input_stat'
  let init_date = new Date()
  stat_date_in.value= String(init_date.getFullYear()) + '-' + String(init_date.getMonth()+1) + '-' + String(init_date.getDate())
  stat_date.appendChild(stat_date_in)  

  let boost = html_row.insertCell(2);
  var boost_in = document.createElement("input")
  boost_in.id = 'input_boostered'
  boost_in.type = 'checkbox'
  boost_in.value = '' 
  boost.appendChild(boost_in)   

  let auth = html_row.insertCell(3);
  var auth_in = document.createElement("input")
  auth_in.id = 'input_author'
  auth_in.type = 'text'
  auth_in.value = '' 
  auth_in.style = "width: 8em;"  
  auth.appendChild(auth_in) 

  let ent_date_entered = html_row.insertCell(4);
  let datum_ent = new Date()
  let value = datum_ent.toLocaleString().replaceAll('/','.').replaceAll(',', ' ').slice(0, 10)
  ent_date_entered.id = 'input_ent'
  ent_date_entered.innerHTML = String(value); 

  let sav_but = html_row.insertCell(5); //calendar week 
  var sav_but_in = document.createElement("button")
  sav_but_in.className = "btn btn-secondary"
  sav_but_in.onclick = function(){save_name(document.getElementById('input_name').value)}
  sav_but_in.innerHTML = 'Sichern'
  sav_but.appendChild(sav_but_in)  

  for (var row of tbl) { 
      let datum = new Date(row[1]*1000)
      let datum_enter = new Date(row[3]*1000)
      
      let html_row = table_html.insertRow(); //init new row 

      let wee = html_row.insertCell(0); 
      wee.innerHTML = String(row[0]);
  
      let date = html_row.insertCell(1); //date formattedd to string 
      let value = datum.toLocaleString().replaceAll('/','.').replaceAll(',', ' ').slice(0, 10)
      date.innerHTML = String(value);

      let boost = html_row.insertCell(2); //booster
      if (row[2] == '1'){
        boost.innerHTML = String('√');
      } else {
        boost.innerHTML = String('X');
      }


      let auth = html_row.insertCell(3); //author
      auth.innerHTML = String(row[4]);

      let date_enter = html_row.insertCell(4); //datum eingetragen
      let value_enter = datum_enter.toLocaleString().replaceAll('/','.').replaceAll(',', ' ').slice(0, 10)
      date_enter.innerHTML = String(value_enter);

      let del_but = html_row.insertCell(5); //calendar week 
      var del_but_in = document.createElement("button")
      del_but_in.className = "btn btn-secondary"
      del_but_in.id = String(row[0])
      changer = String(row[0])
      del_but_in.onclick = help_del
      del_but_in.innerHTML = 'Entfernen'
      del_but.appendChild(del_but_in)  

      // var sixMonthBeforeNow = new Date(new Date().setMonth(new Date().getMonth() - 6))

      // if (datum.getTime() < sixMonthBeforeNow){ // Tage * stunden * minuten * sekunden = 6 monate
      if (row[2] != '1'){
        html_row.style.backgroundColor = "orange"
      } else {
        html_row.style.backgroundColor = "green"
      }
  }
  if (first == true){
    get_ath_trainings()
  }
}

function help_del(){
    var indi = this.id;
    delete_name(indi)
}

function delete_name(name){
    console.log('we delete')
    console.log(name)

    var change_dict = {}
    change_dict[name] = {'name': name, 'flag': 'DELETE'}
    
    if (Object.keys(change_dict).length > 0){
        send_to(change_dict)
    } 
}

function save_name(){
    console.log('we save this row indeed')

    var inp_entered = (new Date()).getTime() /1000

    var inp_name = document.getElementById('input_name').value
    var inp_stat = document.getElementById('input_stat').value.split('-')
    var par = (new Date(Date.UTC(inp_stat[0],inp_stat[1]-1,inp_stat[2],'0','0','0'))).getTime()/1000
    var inp_author = document.getElementById('input_author').value
    if (document.getElementById('input_boostered').checked==true){
      var booster = '1'
    } else {
      var booster = '0'
    }

    var change_dict = {}
    change_dict[inp_name] = {'name': inp_name, 'status_date': par, 'booster': booster, 'ent_date': inp_entered, 'author': inp_author, 'flag': 'SAVE'}
    
    if (Object.keys(change_dict).length > 0){
        console.log('There are changes, send it ')
        send_to(change_dict)
    } 
}

function send_to(change_dict){
  /*
  Post current changes to db and get new data as answer, init it with old ordering rules 
  */
  $.ajax({
      type : 'POST',
      cache : false,
      url: "/status_change/",  
      contentType:"application/json",
      data : JSON.stringify({'data': change_dict}),
      dataType: 'json',
      success : function(response){   
          console.log('response got in')
          if (typeof response == 'object') {
            var tbl_temp = response
            console.log(tbl_temp)
            tbl = [...tbl_temp.data]
            init_table()
          } else {
            console.log('Response is shit')
          }

      }
  });
}

function generate() {
  var doc = new jspdf.jsPDF()
  var temp_table = document.getElementById('data_html')
  temp_table.deleteRow(1)
  var rows = temp_table.rows
  for (var r=0; r< rows.length; r++){
    rows[r].deleteCell(4)
  }
  doc.autoTable({ html: temp_table, useCss: true })
  doc.save('status.pdf')
  setTimeout( function(){ 
    location.reload()
  }, 300);  
}

function help_but(){
  var indi = this.id;
  show_training(indi)
}

function show_training(which){
  document.getElementById('status_table').innerHTML = '';
  const table_html = document.getElementById("status_table");

  let html_row = table_html.insertRow();
  
  let hinweis = html_row.insertCell(0);
  hinweis.innerHTML = "<b>Athleten die für das folgende Training angemeldet sind UND einen Eintrag in der Impftabelle haben: "+which+'</b>';   

  let empt1 = html_row.insertCell(1);
  empt1.innerHTML = '';  

  let empt2 = html_row.insertCell(2);
  empt2.innerHTML = ''; 

  let empt3 = html_row.insertCell(3);
  empt3.innerHTML = ''; 

  let empt4 = html_row.insertCell(4);
  empt4.innerHTML = '';  
  let empt5 = html_row.insertCell(5);
  empt5.innerHTML = '';  

  let w_l = which.length
  let t_which = which 

  let tr_id = t_which.slice(which.indexOf(' am ') + 4, w_l)
  console.log(tr_id)
  var cur_data = cur_ath[tr_id]
  var in_list = []
  for (var row of tbl) { 
      let cur_name = String(row[0])
      // console.log(cur_name)
      // console.log(cur_data['ath'])
      if (cur_data['ath'].includes(cur_name)) {
        in_list.push(cur_name)
        let datum = new Date(row[1]*1000)
        let datum_enter = new Date(row[3]*1000)
        
        let html_row = table_html.insertRow(); //init new row 

        let wee = html_row.insertCell(0); //calendar week 
        wee.innerHTML = String(row[0]);
    
        let date = html_row.insertCell(1); //date formattedd to string 
        let value = datum.toLocaleString().replaceAll('/','.').replaceAll(',', ' ').slice(0, 10)
        date.innerHTML = String(value);

        let boost = html_row.insertCell(2); //booster
        if (row[2] == '1'){
          boost.innerHTML = String('√');
        } else {
          boost.innerHTML = String('X');
        }


        let auth = html_row.insertCell(3); //author
        auth.innerHTML = String(row[4]);

        let date_enter = html_row.insertCell(4); //datum eingetragen
        let value_enter = datum_enter.toLocaleString().replaceAll('/','.').replaceAll(',', ' ').slice(0, 10)
        date_enter.innerHTML = String(value_enter);

        let ent_date_entered = html_row.insertCell(5);
        ent_date_entered.innerHTML = '';  

        // var sixMonthBeforeNow = new Date(new Date().setMonth(new Date().getMonth() - 6))
        // if (datum.getTime() < sixMonthBeforeNow){ // Tage * stunden * minuten * sekunden = 6 monate
        if (row[2] != '1'){
          html_row.style.backgroundColor = "orange"
        } else {
          html_row.style.backgroundColor = "green"
        }
      } 
  }
  let html_row_all_parts = table_html.insertRow();
  let wee1 = html_row_all_parts.insertCell(0); //calendar week 
  wee1.innerHTML = '<b>Alle anderen Teilnehmer des Trainings</b>'
  for (var j=1;j<5;j++){html_row_all_parts.insertCell(j).innerHTML = ''; }

  
  for (var cur in cur_data['ath']){
    if (!in_list.includes(cur_data['ath'][cur])){
      let html_row_all = table_html.insertRow();
      let wee2 = html_row_all.insertCell(0); //calendar week 
      wee2.innerHTML = String(cur_data['ath'][cur]); 
      for (var j=1;j<6;j++){html_row_all.insertCell(j).innerHTML = ''; }
    }
  }
}

function fill_buttons(){
  var buts = document.getElementById('dynamic_buttons')
  for (var tr in cur_ath){
    var sav_but_in = document.createElement("button")
    sav_but_in.className = "btn btn-secondary"
    sav_but_in.onclick = help_but
    sav_but_in.innerHTML = cur_ath[tr]['name'] + '<br>' + cur_ath[tr]['date']
    sav_but_in.id = cur_ath[tr]['name'] + ' am ' + cur_ath[tr]['date']
    sav_but_in.style.margin = "7px"
    buts.appendChild(sav_but_in)  
  }
}

function get_ath_trainings(){
  /*
  Post current changes to db and get new data as answer, init it with old ordering rules 
  */
  $.ajax({
      type : 'POST',
      cache : false,
      url: "/get_parts/",  
      contentType:"application/json",
      data : JSON.stringify({'data': {'null':0}}),
      dataType: 'json',
      success : function(response){   
          console.log('response got in')
          if (typeof response == 'object') {
            var temp_ath = response

            for (var i=0; i<temp_ath['data'].length;i++){
              cur_ath[temp_ath['data'][i]['date']] = temp_ath['data'][i]
            }
            console.log(cur_ath)
            fill_buttons()
          } else {
            console.log('Response is shit')
          }

      }
  });
}
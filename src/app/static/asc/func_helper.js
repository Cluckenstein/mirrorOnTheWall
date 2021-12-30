var seper = false //seperator between weeks if ordered  for date
var orderer = 'date' //order type 
var tbl_archiv = null //if date range save all events here
var trainers = ['KR', 'SB', 'MO', 'CW', 'JE', 'FH', 'MR'] //list of trainers
const front_cols = 3 //cols before trainers in frontend
const back_cols = 1 //cols after trainers in frontend 
const db_front_cols = 2 //cols before trainers in db 
var id_index = 9 //index if training_id in data 
var tbl_vergl = {}; //init compare dict 

//tbl is the main global var which is always the one displayed 

  
function init_table(sep = null, ord = null, after_save = false) {
  /*
  Init table to sort all future events and fill the table for the first time or after entries
  */

    if (ord == null) {
      sort_table('date')
    } else {// if an entry is made keep the oldd sorting  
      sort_table(ord)
    }
    
    var temp_tbl = []
    var now = Math.floor(Date.now() / 1000)
    for (var i = 0; i<tbl.length; i++){ // no future events are shown 
          if (now > tbl[i][1]) {
              temp_tbl.push(tbl[i])
          }
    }
    if (after_save==true){
      tbl_archiv = [...tbl]
    }

    tbl = temp_tbl //redefine new table 

    set_range(init = true) // set current choosen range

    if (sep == null) {
      fill_table(week_sep = true)
    } else {
      fill_table(week_sep = sep) // if an entry is made keep the oldd sorting  
    }

    for (var ent in tbl){ //dict to compare exisitng values with possible entries
        tbl_vergl[tbl[ent][id_index]] = tbl[ent]
    }

}

function sort_table(key, direction = true){
  /*
  Sorts the table for given key
  */
  orderer = key
  if (key == 'disziplin'){
    if (direction == true) {
      tbl.sort(function(a,b) {
        return (a[0]).localeCompare(b[0])
      });
    } else {
      tbl.sort(function(b,a) {
        return (a[0]).localeCompare(b[0])
      });
    }
  } else if (key == 'date'){
    if (direction == true) {
      tbl.sort(function(a,b) {
        return b[1] - a[1]
      });
    } else {
      tbl.sort(function(b,a) {
        return b[1] - a[1]
      });
    }
  } else {
    null
  }
  seper = (key == 'date')
  fill_table(week_sep = seper)
  return true
} 


function fill_table(week_sep = false, unlocker = 'None'){
  /*
  Fills the table front end according to the current sorting 
  */
  var old_week = 0
  var unl = trainers.indexOf(unlocker)

  document.getElementById('termin_table').innerHTML = '';
  const table_html = document.getElementById("termin_table");


  let html_row = table_html.insertRow();
  var sums = Array(trainers.length + back_cols).fill(0) //sums of the current trainers in given date range 
  for (var i =0; i<tbl.length;i++){
    for (var p = 0; p<trainers.length; p++){
      sums[p] += tbl[i][db_front_cols+p]
      sums[trainers.length + back_cols -1 ] += tbl[i][db_front_cols+p] //sums all of it 
    }
  }

  for (var k = 0; k< front_cols+back_cols+trainers.length ;k++){
    if (k == front_cols+back_cols+trainers.length-1){
      let trai = html_row.insertCell(k);
      trai.innerHTML = '∑∑ ' + String(sums[k-front_cols]) //all of it summed
    } else if (k >= front_cols){
      let trai = html_row.insertCell(k);
      trai.innerHTML = '∑ ' + String(sums[k-front_cols])
    } else {
      let trai = html_row.insertCell(k);
      trai.innerHTML = ''
    }
  }


  for (var row of tbl) { 
      let datum = new Date(row[1]*1000)
      if (week_sep == true){ // if the date is ordered between calendar weeks there is one empty row 
        if (old_week != week_no(datum)){
            let html_row = table_html.insertRow();
            for (var j =0; j<10;j++){
                let wee = html_row.insertCell(0);
                wee.innerHTML = '';
            }
        } else {
            null
        } 
      }
      
      old_week = week_no(datum)

      let html_row = table_html.insertRow(); //init new row 

      let wee = html_row.insertCell(0); //calendar week 
      wee.innerHTML = String(old_week);
  
      let disz = html_row.insertCell(1); //event name 
      disz.innerHTML = String(row[0]);

      let date = html_row.insertCell(2); //date formattedd to string 
      let value = datum.toLocaleString().replaceAll('/','.').replaceAll(',', ' ')
      date.innerHTML = String(value);

      for (var k = 0; k<trainers.length;k++){ //trainer values 
          if (k == unl){ //if someone wants to enter, the rows are inputs 
            let trai = html_row.insertCell(3 + k);
            var trai_in = document.createElement("input")
            trai_in.type = 'tel'
            trai_in.id = trainers[k]+String(row[id_index])
            trai_in.value = String(row[db_front_cols+k])
            trai_in.min = 0
            trai_in.max = 99
            trai_in.style = "width: 2em;"    
            trai.appendChild(trai_in)   
          } else { //else they just are values
            let trai = html_row.insertCell(3 + k);
            trai.innerHTML = String(row[3+k-1])
          }
      }
  }
}

function week_no(dt){
  /*
  Get week number given timestamp 
  */

   var tdt = new Date(dt.valueOf());
   var dayn = (dt.getDay() + 6) % 7;
   tdt.setDate(tdt.getDate() - dayn + 3);
   var firstThursday = tdt.valueOf();
   tdt.setMonth(0, 1);
   if (tdt.getDay() !== 4) 
     {
    tdt.setMonth(0, 1 + ((4 - tdt.getDay()) + 7) % 7);
      }
   return 1 + Math.ceil((firstThursday - tdt) / 604800000);
}


function unlock(unlock_id) {
  /*
  Unlocks the values to be editiable
  */
  fill_table(week_sep = seper, unlocker = unlock_id)
}

function save_values(){
  /*
  If button saved then all values are read, compared if the changed and if so listed and then send to db 
  */
  console.log('getting data')
  var all_inputs = document.getElementsByTagName('input');
  var change_dict = {}
  for (var inp =0; inp<all_inputs.length; inp++){
    if (all_inputs[inp].type == 'tel'){
      var trainer_id = all_inputs[inp].id.slice(0,2) //seperate trainer from training id
      var training_id = all_inputs[inp].id.slice(2, all_inputs[inp].id.length)
      var trainer_index = trainers.indexOf(trainer_id) + db_front_cols

      var vergl_ent = tbl_vergl[training_id]
      if (vergl_ent[id_index] == training_id){ //checks if value is changed
          if (vergl_ent[trainer_index] != all_inputs[inp].value){
              change_dict[training_id] = {'training_id':training_id, 'trainer_id': trainer_id, 'value' : all_inputs[inp].value}
          }
      }
    }
  }

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
      url: "/data_change/",  
      contentType:"application/json",
      data : JSON.stringify({'data': change_dict}),
      dataType: 'json',
      success : function(response){   
          console.log('response got in')
          if (typeof response == 'object') {
            var tbl_temp = response
            console.log(tbl_temp)
            tbl = [...tbl_temp.data]
            init_table(sep = seper, ord = orderer, after_save = true)
          } else {
            console.log('Response is shit')
          }

      }
  });
}

function set_range(init_it = false){
  /*
  Get values from range choosers and set the range, save old table to archiv, and reset in beginning
  */
  var range_start = new Date(document.getElementById('range_start').value)
  var range_end = new Date(document.getElementById('range_end').value)
  if (tbl_archiv != null) {
    tbl = tbl_archiv
  }
  console.log(range_start)
  console.log(range_end)

  var temp_tbl_range = []
  var start = Math.floor(range_start / 1000 )
  var end = Math.floor(range_end / 1000 + 86400)//add a day s.t. current day is used too
  tbl_archiv = [...tbl]
  for (var i = 0; i<tbl.length; i++){
        if (end > tbl[i][1] && start< tbl[i][1]) {
          temp_tbl_range.push(tbl[i])
        }
  }
  tbl = temp_tbl_range
  if (init_it == false){
    sort_table(orderer)
  }
}
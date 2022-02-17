from flask import render_template, request, redirect, Response, flash, url_for, session, jsonify
from src.app import app
import src.worker.worker_functions as worker
from copy import deepcopy


### GENERAL ###

@app.route('/', methods=['GET', 'POST'])
def table_status():
    return render_template('mirror/settings.html')
  

@app.route('/get_modules/', methods=['POST'])
def get_modules():
    try:
        modules = worker.get_modules()
        return jsonify(modules)
    except:
        return 'failed'  


### SETTINGS ###

@app.route('/load_settings/', methods=['POST'])
def load_settings():
    try:
        settings = worker.load_settings()
        return jsonify(settings)
    except:
        return 'failed'
    

@app.route('/save_settings/', methods=['POST'])
def save_settings():
    new_settings = request.json
    
    try:
        settings = worker.save_settings(new_settings)
        return jsonify(settings)
    except:
        return 'failed'


### DISPLAY ###    

@app.route('/send_display_change/', methods=['POST'])
def change_display():
    try:
        _ = worker.change_display(request.json['id'][:-9], request.json['status'])
        return jsonify({'status':'success'})
    except:
        return 'failed'


### CLOCK ###

@app.route('/send_clock_change/', methods=['POST'])     
def change_clock():
    new_settings = request.json
    
    try:
        settings = worker.change_clock(new_settings)
        return jsonify({'status':'success'})
    except:
        return 'failed'


@app.route('/send_tz_change/', methods=['POST'])     
def change_tz():
    new_settings = request.json
    
    try:
        settings = worker.change_tz(new_settings)
        return jsonify({'status':'success'})
    except:
        return 'failed'       



### MESSAGE ###

@app.route('/send_message/', methods=['POST'])
def send_message():
    title = request.json['title']
    message = request.json['message']
    timer = request.json['timer']
    try:
        _ = worker.send_message(title, message, timer)
        return jsonify({'status':'success'})
    except:
        return 'failed'
      

### CALENDAR ###

@app.route('/delete_cal/', methods=['POST'])
def delete_cal():
    url = request.json['url']
    try:
        _ = worker.delete_cal(url)
        return jsonify({'status':'success'})
    except:
        return 'failed'


@app.route('/add_cal/', methods=['POST'])
def add_cal():
    url = request.json['url']
    try:
        _ = worker.add_cal(url)
        return jsonify({'status':'success'})
    except:
        return 'failed'
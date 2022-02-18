from flask import render_template, request, redirect, Response, flash, url_for, session, jsonify
from src.app import app
import src.worker.worker_functions as worker
from copy import deepcopy


### GENERAL ###

@app.route('/', methods=['GET', 'POST'])
def table_status():
    return render_template('mirror/settings.html')
  

# LÖSCHEN?
@app.route('/get_modules/', methods=['POST'])
def get_modules():
    try:
        modules = worker.get_modules()
        return jsonify(modules)
    except:
        return 'failed'


@app.route('/init_helper_vars/', methods=['POST'])
def get_helper_vars():
    try:
        helper_vars = worker.get_helper_vars()
        return jsonify(helper_vars)
    except:
        return 'failed'


@app.route('/save_helper_vars/', methods=['POST'])
def save_helper_vars():
    new_helper_vars = request.json
    try:
        helper_vars = worker.save_helper_vars(new_helper_vars)
        return jsonify(helper_vars)
    except:
        return 'failed'


@app.route('/refresh_browser/', methods=['POST'])
def refresh_browser():
    try:
        _ = worker.refresh_browser()
        return jsonify({'status':'success'})
    except:
        return 'failed'


@app.route('/send_pos_change/', methods=['POST'])     
def change_pos():
    new_settings = request.json
    try:
        settings = worker.change_pos(new_settings)
        return jsonify(settings)
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
        return jsonify(settings)
    except:
        return 'failed'


@app.route('/send_tz_change/', methods=['POST'])     
def change_tz():
    new_settings = request.json
    try:
        settings = worker.change_tz(new_settings)
        return jsonify(settings)
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
        settings = worker.delete_cal(url)
        return jsonify(settings)
    except:
        return 'failed'


@app.route('/add_cal/', methods=['POST'])
def add_cal():
    url = request.json['url']
    try:
        settings = worker.add_cal(url)
        return jsonify(settings)
    except:
        return 'failed'


### WEATHER  ###

@app.route('/send_wl_change/', methods=['POST'])
def change_wl():
    new_settings = request.json
    try:
        settings = worker.change_wl(new_settings)
        return jsonify(settings)
    except:
        return 'failed'


### NEWS  ###

@app.route('/send_news_change/', methods=['POST'])
def change_news():
    new_settings = request.json
    try:
        settings = worker.change_news(new_settings)
        return jsonify(settings)
    except:
        return 'failed'             
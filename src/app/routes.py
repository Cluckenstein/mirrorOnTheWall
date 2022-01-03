#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 23 21:40:35 2020

@author: maximilianreihn
"""

from flask import render_template, request, redirect, Response, flash, url_for, session, jsonify
from src.app import app
import src.worker.worker_functions as worker
from copy import deepcopy


@app.route('/', methods=['GET', 'POST'])
def table_status():

    """Main page  which displays the table and is changed and sorted in front end

    Returns:
        render html and data: renders page and gives list of lists to frontend 
    """
    return render_template('mirror/settings.html')


@app.route('/send_message/', methods=['POST'])
def message():
    """If an entry is saved this evaluates, writes to db and responds with updatet data 

    Returns:
        jsonified new data: list of lists
    """
    
    title = request.json['title']
    message = request.json['message']
    timer = request.json['timer']

    try:
        _ = worker.send_message(title, message, timer)
        return 'Success'
    except:
        return 'Failed'
    
@app.route('/get_modules/', methods=['POST'])
def get_mods():
    """If an entry is saved this evaluates, writes to db and responds with updatet data 

    Returns:
        jsonified new data: list of lists
    """
    
    try:
        modules = worker.get_modules()
        return jsonify(modules)
    except:
        return 'Failed'
    
@app.route('/send_view_change/', methods=['POST'])
def change_view():
    """If an entry is saved this evaluates, writes to db and responds with updatet data 

    Returns:
        jsonified new data: list of lists
    """
    
    try:
        _ = worker.change_view(request.json['id'][:-9], request.json['status'])
        return 'Success'
    except:
        return 'Failed'


@app.route('/get_settings/', methods=['POST'])
def get_settings():
    """If an entry is saved this evaluates, writes to db and responds with updatet data 

    Returns:
        jsonified new data: list of lists
    """
    
    try:
        settings = worker.load_settings()
        return jsonify(settings)
    except:
        return 'Failed'
    
@app.route('/save_settings/', methods=['POST'])
def save_settings():
    """If an entry is saved this evaluates, writes to db and responds with updatet data 

    Returns:
        jsonified new data: list of lists
    """
    new_settings = request.json
    
    try:
        settings = worker.save_settings(new_settings)
        return jsonify(settings)
    except:
        return 'Failed'
    

   
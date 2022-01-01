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
    data_json = worker.get_config()
    return render_template('mirror/settings.html', tbl = data_json)


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
        return 200
    except:
        return 404


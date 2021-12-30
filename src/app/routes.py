#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 23 21:40:35 2020

@author: maximilianreihn
"""

from flask import render_template, request, redirect, Response, flash, url_for, session, jsonify
from requests.models import ReadTimeoutError
from flask_login import LoginManager, UserMixin, login_user, logout_user, current_user
from src.app import app
import requests
import json
import os 
from src.worker.worker_functions import *
import src.worker.status_functions as stat
from copy import deepcopy

@app.route('/abrechnung', methods=['GET', 'POST'])
@app.route('/abrechnung/', methods=['GET', 'POST'])
def table_front():
    """Main page  which displays the table and is changed and sorted in front end

    Returns:
        render html and data: renders page and gives list of lists to frontend 
    """

    if session.get('granted'):
        # if session is granted, return table with data else send to password page 
        data_json = get_data_return()
        return render_template('mirror/table_order.html', tbl = data_json)
    else:
        form = token_pw()

        if form.validate_on_submit():
            input_pw = request.form.get("password")
            validated = check_pw(input_pw)
        else:
            validated = False
            return render_template('mirror/password.html', form=form)

        if not validated:
            flash('Invalid password')
            return render_template('mirror/password.html', form=form)
        else:
            session['granted'] = True
            data_json = get_data_return()
            return render_template('mirror/table_order.html', tbl = data_json)


@app.route('/data_change/', methods=['GET', 'POST'])
def data_change_fct():
    """If an entry is saved this evaluates, writes to db and responds with updatet data 

    Returns:
        jsonified new data: list of lists
    """
    cnx, cursor = connect()
    data = request.json['data']
    print('The values changed')
    print(data)
    _ = change_data_db(cnx, cursor, data)

    data_new = fetch_all(cursor, id = True)
    dat = [[k if type(k)!= datetime else datetime.timestamp(k) for k in ent] for ent in data_new]
    data_json = {'data': dat}

    _ = kill_connect(cnx, cursor)

    return jsonify(data_json)


@app.route('/check', methods=['GET', 'POST'])
@app.route('/check/', methods=['GET', 'POST'])
def table_status():
    """Main page  which displays the table and is changed and sorted in front end

    Returns:
        render html and data: renders page and gives list of lists to frontend 
    """

    if session.get('granted'):
        # if session is granted, return table with data else send to password page 
        data_json = stat.get_data_return()
        return render_template('mirror/table_status.html', tbl = data_json)
    else:
        form = token_pw()

        if form.validate_on_submit():
            input_pw = request.form.get("password")
            validated = check_pw(input_pw)
        else:
            validated = False
            return render_template('mirror/password.html', form=form)

        if not validated:
            flash('Invalid password')
            return render_template('mirror/password.html', form=form)
        else:
            session['granted'] = True
            data_json = stat.get_data_return()
            return render_template('mirror/table_status.html', tbl = data_json)


@app.route('/status_change/', methods=['GET', 'POST'])
def status_change_fct():
    """Gets all pdf and returns names of given trainings

    Returns:
        [type]: [description]
    """
    cnx, cursor = stat.connect()
    data = request.json['data']
    print('The values changed')
    print(data)
    for dat in data:
        if data[dat]['flag'] == 'DELETE':
            _ = stat.del_name(cnx, cursor, data[dat]['name'])
            print('deleted name')
        elif data[dat]['flag'] == 'SAVE':
            new_name = data[dat]
            status_date = datetime.fromtimestamp(new_name['status_date'])
            ent_date = datetime.fromtimestamp(new_name['ent_date'])
            _ = stat.add_name(cnx, cursor, new_name['name'], status_date, new_name['booster'], ent_date, new_name['author'])
            print('entered name')

    data_new = stat.fetch_all(cursor)
    dat = [[k if type(k)!= datetime else datetime.timestamp(k) for k in ent] for ent in data_new]
    data_json = {'data': dat}

    _ = stat.kill_connect(cnx, cursor)

    return jsonify(data_json)


@app.route('/get_parts/', methods=['GET', 'POST'])
def parts():
    """If an entry is saved this evaluates, writes to db and responds with updatet data 

    Returns:
        jsonified new data: list of lists
    """
    std_path  = 'src/pdfs'
    print('Here we are ')
    dl_current = stat.dl_parts(path_dl = std_path)
    print('Here we are 2')
    data = []
    for dl in dl_current:
        names, info = stat.get_ath_names(std_path+dl)
        info['ath'] = names
        data.append(info)
    print('Here we are 3')
    print(data)
    data_json = {'data': data}

    return jsonify(data_json)
#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 23 21:40:35 2020

@author: maximilianreihn
"""

import requests
from datetime import datetime,timedelta,date
import json
import string
import random
from sys import platform
from io import StringIO
from html.parser import HTMLParser
import numpy as np
from flask_wtf import FlaskForm

from wtforms import StringField, SubmitField, PasswordField
from wtforms.validators import Required, Length


import mysql.connector
from mysql.connector import errorcode
from icalendar import Calendar, Event
import requests
import os 
import platform
import hashlib
from Crypto.Cipher import AES
from base64 import b64decode, b64encode


def id_generator(size=6, chars=string.digits):
    return ''.join(random.choice(chars) for _ in range(size))

def add_training(cnx, cursor, training_date, disz, training_id):
    """Adds single training  date entry 

    Args:
        cnx (db connection): 
        cursor (db cursor): 
        training_date (datetime object): time and date of training 
        disz (str): Training or event type described

    Returns:
        bool: True if succesful, False else
    """
    adder = ("INSERT INTO termine "
               "(disziplin, date, KR, SB, MO, CW, JE, FH, MR,training_id) "
               "VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s)")

    values = (disz, training_date, 0,0,0,0,0,0,0,training_id)
    # cursor.execute(adder, values)
    # cnx.commit()
    try:
        cursor.execute(adder, values)
        cnx.commit()
        return True
    except Exception as e:
        print(e)
        return False

def create_table(cursor):
    """Creates table in db - should be changed if anything changes

    Args:
        cursor (db connection):
    """
    # 'KR', 'SB', 'MO', 'CW', 'JE', 'FH', 'MR'
    TABLES={}
    
    TABLES['Training'] = (
    "CREATE TABLE `termine` ("
    "  `disziplin` varchar(100) NOT NULL,"
    "  `date` datetime NOT NULL,"
    "  `KR` int NOT NULL DEFAULT 0,"
    "  `SB` int NOT NULL DEFAULT 0,"
    "  `MO` int NOT NULL DEFAULT 0,"
    "  `CW` int NOT NULL DEFAULT 0,"
    "  `JE` int NOT NULL DEFAULT 0,"
    "  `FH` int NOT NULL DEFAULT 0,"
    "  `MR` int NOT NULL DEFAULT 0,"
    "  `training_id` varchar(100) NOT NULL,"
    "  PRIMARY KEY (`training_id`)"
    ") ENGINE=InnoDB")

    for table_name in TABLES:
        table_description = TABLES[table_name]
        try:
            print("Creating table {}: ".format(table_name), end='')
            cursor.execute(table_description)
        except mysql.connector.Error as err:
            if err.errno == errorcode.ER_TABLE_EXISTS_ERROR:
                print("already exists.")
            else:
                print(err.msg)
        else:
            print("OK")

def del_termin(cnx, cursor, termin_id):
    """Deletes entry given the id of the training WATCHOUT IF THERE IS A ENTRY OF MONEY IN THAT ID 

    Args:
        cnx (db connection): 
        cursor (db cursor): 
        termin_id (str): unique identifier of termin

    Returns:
        bool: True if succesful, False else
    """
    try:
        cursor.execute("DELETE FROM termine WHERE training_id = '%s'"%(termin_id))
        cnx.commit()
        return True
    except:
        return False

def get_calendar(save_path, url = 'https://www.spielerplus.de/events/ics?t=algLFV968x&u=QW_iSFhG5m'):
    """Gets calendar and saves it to specified path 

    Args:
        save_path (str): predefined path of save location
        url (str, optional): Calendar subscription. Defaults to 'https://www.spielerplus.de/events/ics?t=algLFV968x&u=QW_iSFhG5m'.

    Returns:
        bool: True if succesful, False else
    """
    try:
        r = requests.post(url)
        save_file = open(save_path, 'wb')
        save_file.write(r.content)
        save_file.close()
        return True
    except:
        return False

def parse_calendar_to_db(cnx, cursor, calendar_path):
    """Adds new events from calendar to db with the needed inform`tin and generates unique id tag 

    Args:
        cnx (db connection): 
        cursor (db cursor): 
        calendar_path (str): path of current calendar 

    Returns:
        bool: True if succesful, False else
    """
    g = open(calendar_path,'rb')
    gcal = Calendar.from_ical(g.read())
    all_current_ids = []
    for component in gcal.walk()[:]:
        if component.name == "VEVENT":
            time = component.get('dtstart').dt
            disz = str(component.get('summary'))
            uq_id = disz[0]+str(time)
            all_current_ids.append(uq_id)
            _ = add_training(cnx, cursor, time, disz, uq_id)
    g.close()

    _ = tag_old_events(cnx, cursor, all_current_ids)

    return True

def tag_old_events(cnx, cursor, ids):
    """Tags old events which are not in the current calendar file anymore as old (will not change any value or delte )

    Args:
        cnx (db connector): 
        cursor (db cursor): 
        ids (list): list of events which are to be tagged as oldd 

    Returns:
        [bool]: True if it worked
    """
    events = fetch_all(cursor)
    del_events = [k for k in events if k[-1] not in ids and 'entfernt' not in k[0]]
    col = 'disziplin'
    for ev in del_events:
        tagged = ev[0]+' (alt/entfernt)'
        training_id = ev[-1]
        print(tagged)
        command = "UPDATE termine SET %s='%s' WHERE training_id='%s'"%(col, tagged, training_id)
        cursor.execute(command)
        cnx.commit()

    return True

def fetch_all(cursor, id = True):
    """Get alll events from Player+

    Args:
        cursor (db cursor): 
        id (bool, optional): Decides wether to ask for unqiue training id . Defaults to True.

    Returns:
        [type]: [description]
    """
    if id:
        query = "SELECT * from termine ORDER BY date"
    else:
        query = "SELECT disziplin, date, KR, SB, MO, CW, JE, FH, MR from termine ORDER BY date"
    cursor.execute(query)

    data = cursor.fetchall()
    return data

def connect(env_file = '.env'):
    """Generates cnx, cursor for db connection

    Args:
        host (str, optional): Host of db. Defaults to "127.0.0.1".

    Returns:
        cnx, cursor: 
    """

    envs = parse_env(env_file)
    cnx = mysql.connector.connect(
        host=envs['DB_SERVER'],
        port=envs['DB_PORT'],
        user=envs['DB_USER'],
        password=envs['DB_PW'],
        database="db")

    cursor = cnx.cursor()

    return cnx, cursor

def kill_connect(cnx, cursor):
    """Kill the connection to the db 

    Args:
        cnx (db connection):
        cursor (db cursor):

    Returns:
        bool: True
    """
    cursor.close()
    cnx.close()
    return True

def add_col(cursor, col_name, col_def, after_col, table = 'termine'):
    """Adds new column to the database ATTENTION if changed then change frontend as well 

    Args:
        cursor (db cursor):
        col_name (str): name of column
        col_def (str): definition, e.g. int, varchar(100)
        after_col (str): Existing col after which this is inserted
        table (str, optional): name of table. Defaults to 'termine'.

    Returns:
        bool: True if succesful, False else
    """
    try:
        exe = "ALTER TABLE %s ADD COLUMN %s %s AFTER %s"%(table, col_name, col_def, after_col)
        cursor.execute(exe)
        return True
    except:
        return False

def change_data_db(cnx, cursor, data):
    """Worker to change entries in db 

    Args:
        cnx (db connection):
        cursor (db cursor):
        data (list)): List of changes to be made
    """
    for change in data:
        trainer = data[change]['trainer_id']
        training_id = data[change]['training_id']
        value = data[change]['value']

        command = "UPDATE termine SET %s=%s WHERE training_id='%s'"%(trainer, value, training_id)
        cursor.execute(command)
        cnx.commit()
    return True

def parse_env(path):
    """Parses vars from env file 

    Args:
        path (str): path to .env fil 

    Returns:
        dict: alle env vars and their names
    """
    env_vars = {}
    with open(path) as f:
        for line in f:
            if line.startswith('#') or not line.strip():
                continue
            key, value = line.strip().split('=', 1)
            env_vars[key] = value
    return env_vars

class token_pw(FlaskForm):
    """Password Form

    Args:
        FlaskForm (object): 
    """
    class Meta:
        csrf = False
    password = PasswordField('Password', validators=[Required()])
    submit = SubmitField('Submit')

def check_last_update(cnx, cursor, day_interval, path = 'src/calendar' ):
    now = datetime.now()
    updates = [k[:-4] for  k in os.listdir(path) if k != 'placeholder']
    for i in range(len(updates)):
        try:
            updates[i] = datetime.fromisoformat(updates[i])
        except:
            updates[i] = 0
    updates = [k for k in updates if k !=  0]
    if len(updates)>0:
        latest = max(updates)
    else:
        latest = datetime(2021, 1, 1)

    if latest + timedelta(days=day_interval) < now:
        c_path = '%s/%s.ics'%(path, now.isoformat())
        _ = get_calendar(c_path)
        _ = parse_calendar_to_db(cnx, cursor, c_path)

        return True

    return False    

def get_data_return(day_interval = 3):
    
    """Gets all the data from db and checks if calendar needs to be updatedd

    Args:
        day_interval (int, optional):interval in which to update calendar. Will be lazy updating and will only be updatet if  route is called. Defaults to 7.

    Returns:
        [list]: All events
    """
    cnx, cursor = connect()
    need_update = check_last_update(cnx, cursor, day_interval)
    if need_update:
        print('Calendar updatet')
    else:
        print('Calendar has all events')
    data = fetch_all(cursor, id = True)
    dat = [[k if type(k)!= datetime else datetime.timestamp(k) for k in ent] for ent in data]
    data_json = dat 

    _ = kill_connect(cnx, cursor)
    return data_json

def check_pw(pw, path = 'src/worker/salthash.json'):
    with open(path) as f:
        data = json.load(f)
        salt = b64decode(data['salt'].encode('utf-8'))
        hash = b64decode(data['hash'].encode('utf-8'))

    to_check = hashlib.pbkdf2_hmac(
            'sha256',
            pw.encode('utf-8'), # Convert the password to bytes
            salt, 
            100000,
            dklen=256
        )

    if to_check == hash:
        return True
    else:
        return False
    
if __name__ == '__main__':
    """Tester 
    """
    None
    # cnx, cursor = connect(env_file='../../.env')
    # _ = check_last_update(cnx, cursor, 1,  path = '../calendar')
    # kill_connect(cnx, cursor)

    data = {'title': 'Styinky stinkt', 'message': 'stinky is amazing', 'timer': 2000}
    headers = {'Content-type': 'application/json'}


    
    r = requests.get('http://192.168.177.108:8082/api/config')#/api/module/alert/showalert' ,headers = headers, data = data)
    
    print(r)
    
    
    
    


  
 

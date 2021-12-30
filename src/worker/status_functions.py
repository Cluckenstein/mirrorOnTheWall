#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 23 21:40:35 2020

@author: maximilianreihn
"""


from datetime import datetime,timedelta,date
import json
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
from PyPDF3 import PdfFileWriter, PdfFileReader  
from selenium import webdriver
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.desired_capabilities import DesiredCapabilities
from requests import Session
import pickle


def add_name(cnx, cursor, name, date_stat, booster, date_ent, author):
    """Adds single training  date entry 

    Args:
        cnx (db connection): 
        cursor (db cursor): 
        training_date (datetime object): time and date of training 
        disz (str): Training or event type described

    Returns:
        bool: True if succesful, False else
    """
    adder = ("INSERT INTO status "
               "(name, date, booster, enter_date, enter_author) "
               "VALUES (%s, %s, %s, %s, %s)")
    
    while name[-1] == " " and len(name) > 1:
        name = name[:-1]

    values = (name, date_stat, int(booster), date_ent, author)
    print(values)
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
    "CREATE TABLE `status` ("
    "  `name` varchar(100) NOT NULL,"
    "  `date` datetime NOT NULL,"
    "  `booster` BIT default 'FALSE',"
    "  `enter_date` datetime NOT NULL,"
    "  `enter_author` varchar(100) NOT NULL,"
    "  PRIMARY KEY (`name`)"
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

def del_name(cnx, cursor, name):
    """Deletes entry given the id of the training WATCHOUT IF THERE IS A ENTRY OF MONEY IN THAT ID 

    Args:
        cnx (db connection): 
        cursor (db cursor): 
        termin_id (str): unique identifier of termin

    Returns:
        bool: True if succesful, False else
    """
    try:
        cursor.execute("DELETE FROM status WHERE name = '%s'"%(name))
        cnx.commit()
        return True
    except:
        return False

def fetch_all(cursor):
    """Get alll events from Player+

    Args:
        cursor (db cursor): 
        id (bool, optional): Decides wether to ask for unqiue training id . Defaults to True.

    Returns:
        [type]: [description]
    """
    
    query = "SELECT * from status ORDER BY name"
    
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

def get_data_return():
    """Gets all the data from db and checks if calendar needs to be updatedd

    Args:
        day_interval (int, optional):interval in which to update calendar. Will be lazy updating and will only be updatet if  route is called. Defaults to 7.

    Returns:
        [list]: All events
    """
    cnx, cursor = connect()
    data = fetch_all(cursor)
    dat = [[k if type(k)!= datetime else datetime.timestamp(k) for k in ent] for ent in data]
    data_json = dat 
    _ = kill_connect(cnx, cursor)
    return data_json

def check_pw(pw, path = 'src/worker/salthash.json'):
    """Checks password against saved hash

    Args:
        pw (str)): Password given by user
        path (str, optional): Path to saved salt hash. Defaults to 'src/worker/salthash.json'.

    Returns:
        bool: status
    """
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

def dl_parts(path_dl = 'src/pdfs', env_file = '.env'):
    """Creates a selenium webdriver in chrome within a remote docker container in order 
        to download the pdfs which contain the athletes signed up for the events in  the
        the following week. Saves the pdf in order to later parse the names.

    Args:
        path_dl (str, optional): Path to download folder of the pdfs. Defaults to 'src/pdfs'.
        env_file (str, optional): Path to env file. Defaults to '.env'.

    Returns:
        list: List of downloaded filenames
    """
    envs = parse_env(env_file)

    payload = {'username': envs['SP_USER'], 'password': envs['SP_PW']} 
    timeout = 1.5  
    
    base_url = "https://www.spielerplus.de"
    url_login = "https://www.spielerplus.de/site/login"
    url_events = "https://www.spielerplus.de/events"
    
    old_cookie_str = [k[len('session_'):18].split('-') for k in os.listdir(path_dl) if 'session_' in k]
    old_cookie_dates = [date(int(k[0]), int(k[1]), int(k[2])) for k in old_cookie_str]
    old_cookie_dates.append(date.min)
    latest = max(old_cookie_dates)
    
    session_exists = latest + timedelta(days = 3) > date.today()
    
    print('Cached session wird verwendet: ', session_exists, ' von ', str(latest))
    if not session_exists:
        
        options = webdriver.ChromeOptions()
        options.add_argument('--disable-dev-shm-usage')
        
        driver = webdriver.Remote("http://"+envs['SEL_SERVER']+":4444/wd/hub", desired_capabilities=options.to_capabilities())
        
        # driver = webdriver.Chrome(executable_path='/Users/maximilianreihn/Downloads/chromedriver')
        driver.get(url_login)

        email = driver.find_element_by_name('LoginForm[email]')
        email.send_keys(payload['username'])
        pw = driver.find_element_by_name('LoginForm[password]')
        pw.send_keys(payload['password'])
        pw.send_keys(Keys.RETURN)
        element_present = EC.presence_of_element_located((By.XPATH, '/html/body/div[7]/div/div/div[1]/div[1]/div')) #wait until the page is logged in 
        WebDriverWait(driver, timeout).until(element_present)
        
        driver.get(url_events)
        element_present = EC.presence_of_element_located((By.ID, 'events')) #wait until the events of the week are loaded
        WebDriverWait(driver, timeout).until(element_present)
        
        all_ids = driver.find_elements_by_xpath('//*[@id]') #get all ids of the page and parse out the training id in ids in all_ids 
        event_ids = {'game':[] , 'event': [], 'training':[], 'tournament':[]}
        
        for ids in all_ids:
            if 'event-game' in ids.get_attribute('id'):
                event_ids['game'].append("".join(filter(str.isdigit, ids.get_attribute('id'))))
            elif 'event-event' in ids.get_attribute('id'):
                event_ids['event'].append("".join(filter(str.isdigit, ids.get_attribute('id'))))
            elif 'event-training' in ids.get_attribute('id'):
                event_ids['training'].append("".join(filter(str.isdigit, ids.get_attribute('id'))))
            elif 'event-tournament' in ids.get_attribute('id'):
                event_ids['tournament'].append("".join(filter(str.isdigit, ids.get_attribute('id'))))   
        
        driver_cooks = driver.get_cookies()
        save_cooks = []
        for ck in driver_cooks:
            if 'expiry' in ck.keys():
                if datetime.fromtimestamp(ck['expiry']) > datetime.today() + timedelta(days = 2):
                    save_cooks.append(ck)
            else:
                save_cooks.append(ck)
                
        dump_session = {'ids': event_ids, 'cookies':save_cooks}
        pickle.dump(dump_session, open(path_dl+'/session_%s.pkl'%(str(date.today())),'wb'))        
        selenium_user_agent = driver.execute_script("return navigator.userAgent;") #so that page thinks we are not a bot
        
    else:
        sess = pickle.load(open(path_dl+'/session_%s.pkl'%(str(latest)), "rb"))
        driver_cooks = sess['cookies']
        event_ids = sess['ids']
        
        options = webdriver.ChromeOptions()
        options.add_argument('--disable-dev-shm-usage')
        driver = webdriver.Remote("http://"+envs['SEL_SERVER']+":4444/wd/hub", desired_capabilities=options.to_capabilities())
        
        # driver = webdriver.Chrome(executable_path='/Users/maximilianreihn/Downloads/chromedriver')
        
        driver.get(base_url)
        for cookie in driver_cooks:
            driver.add_cookie(cookie)
            
        selenium_user_agent = driver.execute_script("return navigator.userAgent;")
            
    s = Session() #get session cookies such that page thinks we are logged in 
    s.headers.update({"user-agent": selenium_user_agent})
    for cookie in driver_cooks:
        s.cookies.set(cookie['name'], cookie['value'], domain=cookie['domain'])
    
    downloads = [] #download all lists as pdf by route below and save
    for ev_type in event_ids:
        for ev in event_ids[ev_type]:
            url_req = "%s/print?route=%%2F%s%%2Fprint-participant-list&params%%5Bid%%5D=%s"%(base_url, ev_type, ev)
            response = s.post(url_req)
            downloads.append('/list_%s_%s.pdf'%(ev_type, ev))
            with open(path_dl+'/list_%s_%s.pdf'%(ev_type, ev), 'wb') as f:
                f.write(response.content)
                
    driver.close() #quit driver in order to be usable again
    driver.quit()             
    return downloads #list of download names

def get_ath_names(pdf_path):
    """Parses pdf to get the names

    Args:
        pdf_path (str): Path to folder with alle the pdfs

    Returns:
        tuple: list of names, dict of infos
    """
    pdf_file = open(pdf_path, 'rb')
    read_pdf = PdfFileReader(pdf_file)
    number_of_pages = read_pdf.getNumPages()
    athletes = ''
    training_name = read_pdf.getPage(0).extractText().split('\n')[4]
    training_date = read_pdf.getPage(0).extractText().split('\n')[6]
    for page in range(number_of_pages):
        pg = read_pdf.getPage(page)
        pg_cont = pg.extractText()[pg.extractText().index('Unterschrift')+len('Unterschrift'):]
        athletes += pg_cont
    athletes = "".join([s for s in athletes.strip().splitlines(True) if s.strip()]).split("\n")
    ath_names = []
    for k in range(len(athletes)):
        if 'Athlet' in athletes[k]:
            ath_names.append(athletes[k-1])

    return ath_names, {'name':training_name, 'date': training_date}

if __name__ == '__main__':
    """Tester 
    """
    None
    # dl_parts(path_dl='/Users/maximilianreihn/Desktop/test', env_file='../../.env')
    # a,b = get_ath_names('/Users/maximilianreihn/Downloads/list_training_27823347.pdf')
    # print(b)
    cnx, cur = connect(env_file = '../../.env')
    names = ['Sebastian Fader']
    for name in names:
        
        command = "UPDATE status SET booster=1 WHERE name='%s'"%(name)
        cur.execute(command)
        cnx.commit()
    
    # cmd = "ALTER TABLE status ADD booster BIT default FALSE AFTER date"
    # cur.execute(cmd)
    # cur.commit()
    _ = kill_connect(cnx, cur)

            

    
    
    


  
 

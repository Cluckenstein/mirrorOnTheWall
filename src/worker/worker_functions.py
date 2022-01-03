#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 23 21:40:35 2020

@author: maximilianreihn
"""

import requests
import json 

def get_config():
    ip_network = parse_env('.env')['IP_OWN']
    r = requests.get('http://%s:8082/api/config'%(ip_network))
    modules = r.json()['data']['modules']
    return [{'name': k['module'], 'config':k['config']} for k in modules if 'config' in k.keys() ]


def send_message(title, message , timer, env_path = '.env'):
    ip_network = parse_env(env_path)['IP_OWN']
    if timer == '':
        timer = 3000
    
    data = {'title': title, 'message': message, 'timer': 1000*int(timer)}
    headers = {'Content-Type': 'application/json'}

    r = requests.post('http://%s:8082/api/module/alert/showalert'%(ip_network) , headers = headers, data = json.dumps(data))
    
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


def get_modules(env_path = '.env'):
    ip_network = parse_env(env_path)['IP_OWN']
    r = requests.get('http://%s:8082/api/module'%(ip_network))
    dic = r.json()
    
    mods = {}
    
    for modul in dic['data']:
        if modul['name'] not in mods:
            mods[modul['name']] = []
           
        mods[modul['name']].append(modul)
        
        if modul['name'] == 'weather':
            switch_name = modul['name'][0].upper()+modul['name'][1:] + ' ' + modul['config']['location']
        else:
            switch_name = modul['name'][0].upper()+modul['name'][1:]
            
        mods[modul['name']][-1]['switch_name'] = switch_name
    
    return mods 


def change_view(id, status, env_path = '.env'):
    ip_network = parse_env(env_path)['IP_OWN']
    if status:
        changer = 'show'
    else:
        changer = 'hide'
     
    r = requests.get('http://%s:8082/api/module/%s/%s'%(ip_network, id, changer))
       
    return True

if __name__ == '__main__':
    """Tester 
    """
    None

    data = {'position': 'top_right'}
    headers = {'Content-Type': 'application/json'}
    r = requests.post("http://192.168.177.108:8082/api/module/clock", headers = headers)#, data = json.dumps(data))
    print(r, r.json())
        

    # r = requests.post('http://192.168.177.108:8081/send_view_change/' , headers = headers, data = json.dumps(data))
    
    # print(r)
    
    


  
 

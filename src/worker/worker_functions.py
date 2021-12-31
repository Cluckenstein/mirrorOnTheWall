#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 23 21:40:35 2020

@author: maximilianreihn
"""

import requests
import json 


def get_config():
    r = requests.get('http://192.168.177.108:8082/api/config')
    modules = r.json()['data']['modules']
    return [{'name': k['module'], 'config':k['config']} for k in modules if 'config' in k.keys() ]


def send_message(title, message , timer):
    
    if timer == '':
        timer = 3000
    
    data = {'title': title, 'message': message, 'timer': 1000*int(timer)}
    headers = {'Content-Type': 'application/json'}

    r = requests.post('http://192.168.177.108:8082/api/module/alert/showalert' , headers = headers, data = json.dumps(data))
    
    return True

if __name__ == '__main__':
    """Tester 
    """
    None

    data = {'title': 'Styinky stinkt', 'message': 'stinky is amazing', 'timer': 2000}
    headers = {'Content-Type': 'application/json'}


    
    # r = requests.get('http://192.168.177.108:8082/api/config')
    # r = requests.get('http://192.168.177.108:8082/api/module/alert/showalert?message=Stinky stinkt&timer=2000')
    
    
    # r = requests.post('http://192.168.177.108:8082/api/module/alert/showalert' , headers = headers, data = json.dumps(data))
    r = requests.post('http://192.168.177.108:8082/api/module/compliments' , headers = headers, data = json.dumps(data))
    print(r, r.json()['data'][0]['actions'])
    
    
    
    


  
 

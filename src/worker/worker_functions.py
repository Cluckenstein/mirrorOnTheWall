#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 23 21:40:35 2020

@author: maximilianreihn
"""

import requests
import json 
import socket

def get_config():
    ip_network = socket.gethostbyname(socket.gethostname())
    r = requests.get('http://%s:8082/api/config'%(ip_network))
    modules = r.json()['data']['modules']
    return [{'name': k['module'], 'config':k['config']} for k in modules if 'config' in k.keys() ]


def send_message(title, message , timer):
    ip_network = socket.gethostbyname(socket.gethostname())
    if timer == '':
        timer = 3000
    
    data = {'title': title, 'message': message, 'timer': 1000*int(timer)}
    headers = {'Content-Type': 'application/json'}

    r = requests.post('http://%s:8082/api/module/alert/showalert'%(ip_network) , headers = headers, data = json.dumps(data))
    
    return True

if __name__ == '__main__':
    """Tester 
    """
    None

    data = {'title': 'Styinky stinkt', 'message': 'stinky is amazing', 'timer': 5000, 'imageUrl': 'https://cdn.prod.www.spiegel.de/images/ca38ce6d-0001-0005-0000-000000862775_w750_r1.5_fpx47.34_fpy47.jpg'}
    headers = {'Content-Type': 'application/json'}


    
    r = requests.get('http://192.168.178.26:8082/api/config')
    # r = requests.get('http://192.168.177.108:8082/api/module/alert/showalert?message=Stinky stinkt&timer=2000')

    
    
    # r = requests.post('http://192.168.177.108:8082/api/module/alert/showalert' , headers = headers, data = json.dumps(data))
    # r = requests.post('http://192.168.177.108:8082/api/module/compliments' , headers = headers, data = json.dumps(data))
    print(r)#, r.json())#['data'][0]['actions'])
    
    
    
    


  
 

#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 23 21:40:35 2020

@author: maximilianreihn
"""

import requests
import json 

if __name__ == '__main__':
    """Tester 
    """
    None
    # cnx, cursor = connect(env_file='../../.env')
    # _ = check_last_update(cnx, cursor, 1,  path = '../calendar')
    # kill_connect(cnx, cursor)

    data = {'title': 'Styinky stinkt', 'message': 'stinky is amazing', 'timer': 2000}
    headers = {'Content-Type': 'application/json'}


    
    # r = requests.get('http://192.168.177.108:8082/api/config')
    # r = requests.get('http://192.168.177.108:8082/api/module/alert/showalert?message=Stinky stinkt&timer=2000')
    
    
    r = requests.post('http://192.168.177.108:8082/api/module/alert/showalert' , headers = headers, data = json.dumps(data))
    
    print(r, r.content)
    
    
    
    


  
 

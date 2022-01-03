#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 23 21:40:35 2020

@author: maximilianreihn
"""

import requests
import json 
import os 

def get_config():
    ip_network = parse_env(".env")["IP_OWN"]
    r = requests.get("http://%s:8082/api/config"%(ip_network))
    modules = r.json()["data"]["modules"]
    return [{"name": k["module"], "config":k["config"]} for k in modules if "config" in k.keys() ]


def send_message(title, message , timer, env_path = ".env"):
    ip_network = parse_env(env_path)["IP_OWN"]
    if timer == "":
        timer = 3000
    
    data = {"title": title, "message": message, "timer": 1000*int(timer)}
    headers = {"Content-Type": "application/json"}

    r = requests.post("http://%s:8082/api/module/alert/showalert"%(ip_network) , headers = headers, data = json.dumps(data))
    
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
            if line.startswith("#") or not line.strip():
                continue
            key, value = line.strip().split("=", 1)
            env_vars[key] = value
    return env_vars


def get_modules(env_path = ".env"):
    ip_network = parse_env(env_path)["IP_OWN"]
    r = requests.get("http://%s:8082/api/module"%(ip_network))
    dic = r.json()
    
    mods = {}
    
    for modul in dic["data"]:
        if modul["name"] not in mods:
            mods[modul["name"]] = []
           
        mods[modul["name"]].append(modul)
        
        if modul["name"] == "weather":
            switch_name = modul["name"][0].upper()+modul["name"][1:] + " " + modul["config"]["location"]
        else:
            switch_name = modul["name"][0].upper()+modul["name"][1:]
            
        mods[modul["name"]][-1]["switch_name"] = switch_name
    
    return mods 


def change_view(id, status, env_path = ".env"):
    ip_network = parse_env(env_path)["IP_OWN"]
    if status:
        changer = "show"
    else:
        changer = "hide"
     
    r = requests.get("http://%s:8082/api/module/%s/%s"%(ip_network, id, changer))
       
    return True


def mod_config(config_path = "magic_mirror/settings/settings_display.json", server_config_path = "magic_mirror/config/server_config.json", server_js = "magic_mirror/config/config.js"):

    with open(config_path, "r") as f:
        our_config = json.load(f)
        
    with open(server_config_path, "r") as f:
        server_config = json.load(f)
        
    
    for module in our_config:
        if module == "clock":
            server_config["clock_1"]["position"] = our_config[module]["position"]
            server_config["clock_2"]["position"] = our_config[module]["position"]
            server_config["clock_1"]["config"] = our_config[module]["clock_1"]
            server_config["clock_2"]["config"] = our_config[module]["clock_2"]
            
        elif module == "calendar":
            server_config["calendar"]["position"] = our_config[module]["position"]
            server_config["calendar"]["config"]["calendars"] = our_config[module]["calendars"]
            
        elif module == "weather":
            server_config["weather_1"]["position"] = our_config[module]["position"]
            server_config["weather_2"]["position"] = our_config[module]["position"]
            server_config["weather_1"]["config"] = our_config[module]["weather_1"]
            server_config["weather_2"]["config"] = our_config[module]["weather_2"]
            
        elif module == "news":
            server_config["news_1"]["position"] = our_config[module]["position"]
            server_config["news_2"]["position"] = our_config[module]["position"]
            
            server_config["news_1"]["config"]["feeds"] = our_config[module]["news_1"]["feeds"]
            server_config["news_2"]["config"]["feeds"] = our_config[module]["news_2"]["feeds"]


    with open(server_config_path, "w") as f:
        json.dump(server_config, f, indent=4)
        
    new_config = [server_config[k] for k in server_config]
    
    with open(server_js, "r") as f:
        js_text = f.read()
        
    js_begin = js_text.index("// BEGIN PARSER")
    js_end = js_text.index("// END PARSER")
    
    js_head = js_text[:js_begin + len("// BEGIN PARSER")] + "\n"
    js_tail = "\n"+ js_text[js_end:]
    
    js_txt = js_head + "modules:" + str(new_config) + js_tail
    
    with open(server_js, "w") as f:
        f.write(js_txt)
        
        
    ip_network = parse_env(".env")["IP_OWN"]
    r = requests.get("http://%s:8082/api/refresh"%(ip_network))
        
    return True
                    
   
def save_settings(changes, config_path = "magic_mirror/settings/settings_display.json", server_config_path = "magic_mirror/config/server_config.json", server_js = "magic_mirror/config/config.js"):
    
    with open(config_path, "w") as f:
        json.dump(changes, f)

    _ = mod_config(config_path, server_config_path, server_js)
        
    return changes
            

def load_settings(config_path = "magic_mirror/settings/settings_display.json", server_config_path = "magic_mirror/config/server_config.json", server_js = "magic_mirror/config/config.js"):
    
    with open(config_path, "r") as f:
        our_config = json.load(f)
        
    _ = mod_config(config_path, server_config_path, server_js)
    
    
    return our_config
    
        

if __name__ == "__main__":
    """Tester 
    """
    None

    # data = {"position": "top_right"}
    # headers = {"Content-Type": "application/json"}
    # r = requests.post("http://192.168.177.108:8082/api/module/clock", headers = headers)#, data = json.dumps(data))
    # print(r, r.json())
        

    # r = requests.post("http://192.168.177.108:8081/send_view_change/" , headers = headers, data = json.dumps(data))
    # print(r)
    
    # mod_config(config_path = "../../magic_mirror/settings/settings_display.json", server_config_path = "../../magic_mirror/config/server_config_test.json", server_js = "../../magic_mirror/config/config_test.js")
    r = requests.get("http://192.168.177.108:8082/api/module")
    
    print(r, r.json())
    


  
 

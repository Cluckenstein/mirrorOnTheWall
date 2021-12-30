#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Created on Wed Dec 23 21:38:29 2020

@author: maximilianreihn
"""


from flask import Flask, session
from flask_bootstrap import Bootstrap
from flask_cors import CORS
import os
from werkzeug.debug import DebuggedApplication
from flask_wtf.csrf import CSRFProtect
from flask_wtf import FlaskForm

app = Flask(__name__)
SECRET_KEY = os.urandom(32)
app.config['SECRET_KEY'] = SECRET_KEY

# app.debug = True
# app.wsgi_app = DebuggedApplication(app.wsgi_app, True)

bootstrap = Bootstrap(app)

cors = CORS(app)

from src.app import routes



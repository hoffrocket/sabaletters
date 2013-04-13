#!/usr/bin/env python
# -*- coding: utf-8 -*-


import flask
from werkzeug.routing import BaseConverter
from sitegen import LetterRenderer

app = flask.Flask(__name__)

class RegexConverter(BaseConverter):
  def __init__(self, url_map, *items):
    super(RegexConverter, self).__init__(url_map)
    self.regex = items[0]

app.url_map.converters['regex'] = RegexConverter

@app.route('/<regex("[0-9]{4}-[0-9]{2}-[0-9]{2}"):letter_name>.html')
def letter(letter_name):
  letter_renderer = LetterRenderer()
  return letter_renderer.render_letter(letter_name)

@app.route('/timeline.js')
def timelinejs():
  letter_renderer = LetterRenderer()
  return letter_renderer.render_timeline_js()

@app.route('/timeline.js')
def timelinejs():
  letter_renderer = LetterRenderer()
  return letter_renderer.render_timeline_js()

@app.route('/bootstrap/<path:filename>')
def bootstrap(filename):
  return flask.send_from_directory('bootstrap/',filename)

@app.route('/letter-img/<path:filename>')
def letter_img(filename):
  return flask.send_from_directory('letter-img',filename)

if __name__ == "__main__":
  app.run(debug=True)
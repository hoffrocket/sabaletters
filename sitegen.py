#!/usr/bin/env python
# -*- coding: utf-8 -*-

from jinja2 import Environment, PackageLoader
import os
import sys
from markdown import markdown
import shutil
import datetime
import json

reload(sys)
sys.setdefaultencoding('utf-8')

class LetterRenderer:
  def __init__(self):
    env = Environment(loader=PackageLoader('sitegen', 'template'))
    self.timeline_template = env.get_template("timeline.js")
    self.letter_template = env.get_template("letter.html")
    self.all_letters = [f[:-9] for f in os.listdir('letter')]
    self.letter_images = dict((f[:-4], f) for f in os.listdir('letter-img'))

  def render_timeline_js(self):
    hashes = [{'date': n } for n in self.all_letters]
    return self.timeline_template.render(timeline_data = json.dumps(hashes))
  
  def render_letter(self, letter_name):
    with open("letter/" + letter_name + ".markdown") as letter:
      letter_mardown = markdown(letter.read())
      date = datetime.datetime.strptime(letter_name,"%Y-%m-%d").strftime("%B %d, %Y")
      return self.letter_template.render(letter = letter_mardown, 
        date = date, 
        image = self.letter_images.get(letter_name))

if __name__ == "__main__":
  shutil.rmtree("site")
  os.mkdir("site")
  # copy static stuff to the site

  shutil.copytree("bootstrap/", "site/bootstrap")
  shutil.copytree("letter-img/", "site/letter-img")

  letter_renderer = LetterRenderer()
  # render all the letters
  for letter_name in letter_renderer.all_letters:
    with open("site/" + letter_name + ".html", "w") as outFile:
      outFile.write(letter_renderer.render_letter(letter_name))

  # render the timeline
  with open("site/timeline.js", "w") as out:
    out.write(letter_renderer.render_timeline_js())
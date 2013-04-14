#!/usr/bin/env python
# -*- coding: utf-8 -*-

from datetime import timedelta, datetime
import boto
import os
import boto.s3
from boto.s3.key import Key
from pprint import pprint
import sitegen

KEY = os.environ['aws_key']
SECRET = os.environ['aws_secret']

def do_upload(key, file_pointer):
  cache_time = 60 * 5
  now = datetime.now()
  expire_dt = now + timedelta(seconds=cache_time * 1.5)
  key.set_contents_from_file(file_pointer, policy="public-read",
    headers={
      'Cache-Control': 'max-age=%d, must-revalidate' % int(cache_time),
      'Expires': expire_dt.strftime("%a, %d %b %Y %H:%M:%S GMT")
    })


def upload_dir_to_s3(bucket, src_dir):
  c = boto.connect_s3(KEY, SECRET)
  b = c.get_bucket(bucket)

  for path,dir,files in os.walk(src_dir):
    for file in files:
      relative_path = os.path.relpath(os.path.join(path,file), src_dir)
      key = b.get_key(relative_path) or b.new_key(relative_path)

      with open(os.path.join(path, file)) as file_pointer:
        if not key.etag:
          print("Creating: " + key.key)
          do_upload(key, file_pointer)
        else:
          md5 = key.compute_md5(file_pointer)
          etag = key.etag or ''
          # for some weird reason, etags are quoted, strip them
          etag = etag.strip('"').strip("'")
          if etag not in md5:
            do_upload(key, file_pointer)
            print("Updating: " + key.key)
          else:
              print("Skipping: " + key.key)


if __name__ == "__main__":
  sitegen.gen()
  upload_dir_to_s3('sabaletters', 'site')

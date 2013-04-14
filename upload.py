#!/usr/bin/env python
# -*- coding: utf-8 -*-

from datetime import timedelta, datetime
import boto
import os
import boto.s3
from boto.s3.key import Key
from pprint import pprint

KEY = os.environ['aws_key']
SECRET = os.environ['aws_secret']

def do_upload(key, fp):
    cache_time = 60 * 5
    now = datetime.now()
    expire_dt = now + timedelta(seconds=cache_time * 1.5)
    key.set_contents_from_file(fp, policy="public-read",
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

      file_name = os.path.join(path, file)
      fp = open(file_name)

      if not key.etag:
        print("Creating: " + key.key)
        do_upload(key, fp)
      else:
        md5 = key.compute_md5(fp)
        etag = key.etag or ''
        # for some weird reason, etags are quoted, strip them
        etag = etag.strip('"').strip("'")
        if etag not in md5:
            do_upload(key, fp)
            print("Updating: " + key.key)
        else:
            print("Skipping: " + key.key)

      

if __name__ == "__main__":
    upload_dir_to_s3('sabaletters', 'site')
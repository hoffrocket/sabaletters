#!/usr/bin/env python
# -*- coding: utf-8 -*-

import boto
import os
import boto.s3
from boto.s3.key import Key
from pprint import pprint

KEY = os.environ['aws_key']
SECRET = os.environ['aws_secret']


def uploadDirToS3(bucket,srcDir):
  c = boto.connect_s3(KEY, SECRET)
  b = c.get_bucket(bucket)

  for path,dir,files in os.walk(srcDir):
    for file in files:
      relative_path = os.path.relpath(os.path.join(path,file),srcDir)
      key = b.get_key(relative_path) or b.new_key(relative_path)

      file_name = os.path.join(path, file)
      if not key.etag:
        print("Creating: " + key.key)
        key.set_contents_from_filename(file_name)
        b.set_acl('public-read', key.key)
      else:
        fp = open(file_name)
        md5 = key.compute_md5(fp)
        etag = key.etag or ''
        # for some weird reason, etags are quoted, strip them
        etag = etag.strip('"').strip("'")
        if etag not in md5:
            key.set_contents_from_file(fp)
            print("Updating: " + key.key)
        else:
            print("Skipping: " + key.key)

      

if __name__ == "__main__":
    uploadDirToS3('sabaletters', 'site')
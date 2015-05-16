var request = require('request')
  //, url = 'https://registry.npmjs.com/-/all'
  , url = 'https://skimdb.npmjs.com/registry/_design/app/_view/listAll'
  , fs = require('fs')
  , fp = '/Volumes/Storage/npm/data.json'

request.get(url).pipe(fs.createWriteStream(fp))

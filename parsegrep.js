#!/usr/bin/env node

process.stdin.on('data', function(chunk) {
  chunk = chunk.toString()
  var chunks = chunk.split('\n')
  for (var i=0, len=chunks.length; i<len; i++) {
    if (chunks[i]) {
      parseChunk(chunks[i])
    }
  }
})

var re1 = /([\d]+.[\d]+.[\d]+)/

function parseChunk(chunk) {
  var splits = chunk.split(':')
  var file = splits.shift()
  var code = splits.join(':')
  // ./packagename-x.x.x/file
  var splits2 = file.split('/')
  splits2.shift()
  var filevers = splits2.shift()
  var fp = splits2.join('/')
  if (!filevers) {
    //console.log('missing', chunk)
    return
  }
  var i = parseVersion(filevers)
  console.log(i.name, i.vers, fp)
}

function parseVersion(name) {
  var foundVers = false
  var vers = ''
  var splits = name.split('-')
  var len = splits.length
  while (len--) {
    var item = splits[len]
    if (!re1.test(vers)) {
      if (vers) {
        vers = splits.pop() + '-' + vers
      } else {
        vers = splits.pop() + vers
      }
    } else {
      foundVers = true
      break
    }
  }

  return {
    vers: vers
  , name: name.replace('-' + vers, '')
  }
}

var request = require('request')
  , async = require('async')
  , data = require('/Volumes/Storage/npm/data-fixed')
  , path = require('path')
  , dir = '/Volumes/Storage/npm/tarballs2'
  , fs = require('fs')
  , url = require('url')
  , npm = require('npm')
  , unpack = require('npm/lib/utils/tar').unpack

var found = false
data = data.filter(function(item) {
  if (found) return true
  if (~item.name.indexOf('sweetberry')) {
    found = true
    return true
  }
  return false
})

function exists(tarball, cb) {
  var p = url.parse(tarball).path.split('/')
  p = p[p.length-1]
  var fp = path.join(dir, p).replace('.tgz', '')

  fs.exists(fp, function(e) {
    cb(null, e, fp)
  })
}

function fetchIfNeeded(pkg, cb) {
  console.log(pkg)
  exists(pkg.url, function(err, exist, fp) {
    if (exist) {
      console.log(`${pkg.name} already exists`)
      return cb(null, fp)
    }
    request.get(pkg.url)
      .pipe(fs.createWriteStream(fp + '.tgz'))
      .on('close', function() {
        cb(null, fp)
      })
      .on('error', cb)
  })
}

function fetchAndExtract(pkg, cb) {
  fetchIfNeeded(pkg, function(err, fp) {
    if (err) return cb(err)
    var fpwext = fp + '.tgz'
    unpack(fpwext, fp, function(err, out) {
      if (err) return cb()
      cb(null, out)
    })
  })
}

var item = data[0]
npm.load({}, function() {
  async.eachLimit(data, 5, function(pkg, cb) {
    fetchAndExtract(pkg, cb)
  }, function(err) {
    if (err) throw err
    console.log('done')
  })
})

var JSONStream = require('JSONStream')
  , through = require('through2')
  , fs = require('fs')
var fp = '/Volumes/Storage/npm/data.json'

var count = 0
var stream = fs.createWriteStream('/Volumes/Storage/npm/data-fixed.json')
fs.createReadStream(fp)
  .pipe(JSONStream.parse('rows.*'))
  .pipe(through.obj(function(chunk, enc, cb) {
    if (!count) this.push('[')
    count++
    var tb = getTarball(chunk)
    if (!tb) return cb()
    var o = {
      name: chunk.id
    , url: tb
    }
    this.push(JSON.stringify(o) + ',\n')
    console.log(count)
    if (count === 156725) this.push(']')
    cb()
  }))
  .pipe(stream)

function getTarball(pkg) {
  var pkg = pkg.value
  var name = pkg.name
  if (!pkg['dist-tags']) return false
  var latest = pkg['dist-tags'].latest
  var vers = pkg.versions[latest]
  if (!vers) return false
  return vers.dist.tarball
}

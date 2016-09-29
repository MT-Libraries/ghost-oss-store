var util = require('util')
var fs = require('fs')
var path = require('path')
var Promise = require('bluebird')
var OSS = require('ali-oss').Wrapper

var utils = require(path.join(process.cwd(), 'core/server/utils'))
var baseStore = require(path.join(process.cwd(), 'core/server/storage/base'))

function OssStore(config) {  
  baseStore.call(this);
  this.options = config || {}
  this.client = new OSS(this.options)  
}

util.inherits(OssStore, baseStore);

OssStore.prototype.save = function (file, targetDir) {
  var client = this.client
  var origin = this.options.origin  
  var key = this.getFileKey(file)

  return new Promise(function (resolve, reject) {
    return client.put(
      key, 
      fs.createReadStream(file.path)
    )
    .then(function (result) {
      // console.log(result)
      if(origin){
        resolve(path.join(origin, result.name))
      }else{
        resolve(result.url)
      }      
    })
    .catch(function (err) {
      // console.log(err)
      reject(false)
    })
  })
}

OssStore.prototype.exists = function (filename) {
  // console.log('exists',filename)
  var client = this.client  

  return new Promise(function (resolve, reject) {
    return client.head(filename).then(function (result) {
      // console.log(result)
      resolve(true)
    }).catch(function (err) {
      // console.log(err)
      reject(false)
    })

  })
}

OssStore.prototype.serve = function (options) {  
  return function (req, res, next) {
    next();
  }
}

OssStore.prototype.delete = function (filename) {
  var client = this.client  

  // console.log('del',filename)
  return new Promise(function (resolve, reject) {
    return client.delete(filename).then(function (result) {
      // console.log(result)
      resolve(true)
    }).catch(function (err) {
      // console.log(err)
      reject(false)
    })
  })
}

OssStore.prototype.getFileKey = function (file) {
  var keyOptions = this.options.fileKey

  if (keyOptions) {
    var getValue = function (obj) {
      return typeof obj === 'function' ? obj() : obj
    };
    var ext = path.extname(file.name)
    var name = path.basename(file.name, ext)

    if (keyOptions.safeString) {
      name = utils.safeString(name)
    }

    if (keyOptions.prefix) {
      name = path.join(keyOptions.prefix, name);
    }

    if (keyOptions.suffix) {
      name += getValue(keyOptions.suffix)
    }

    return name + ext.toLowerCase();
  }

  return null;
}

module.exports = OssStore
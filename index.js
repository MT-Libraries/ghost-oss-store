var util = require('util')
var fs = require('fs')
var path = require('path')
var Promise = require('bluebird')
var OSS = require('ali-oss').Wrapper
const unidecode = require('unidecode')
function safeString (string, options) {
  options = options || {};

  if (string === null) {
    string = '';
  }

  // Handle the £ symbol separately, since it needs to be removed before the unicode conversion.
  string = string.replace(/£/g, '-');

  // Remove non ascii characters
  string = unidecode(string);

  // Replace URL reserved chars: `@:/?#[]!$&()*+,;=` as well as `\%<>|^~£"{}` and \`
  string = string.replace(/(\s|\.|@|:|\/|\?|#|\[|\]|!|\$|&|\(|\)|\*|\+|,|;|=|\\|%|<|>|\||\^|~|"|\{|\}|`|–|—)/g, '-')
    // Remove apostrophes
    .replace(/'/g, '')
    // Make the whole thing lowercase
    .toLowerCase();

  // We do not need to make the following changes when importing data
  if ((!options.hasOwnProperty('importing')) || !options.importing) {
    // Convert 2 or more dashes into a single dash
    string = string.replace(/-+/g, '-')
      // Remove trailing dash
      .replace(/-$/, '')
      // Remove any dashes at the beginning
      .replace(/^-/, '');
  }

  // Handle whitespace at the beginning or end.
  string = string.trim();

  return string;
}

var baseStore = require('ghost-storage-base')

class OssStore extends baseStore {
  constructor (config) {
    super(config)
    this.options = config || {}
    this.client = new OSS(this.options)
  }

  save (file, targetDir) {
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

  exists (filename) {
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
  
  serve (options) {  
    return function (req, res, next) {
      next();
    }
  }
  
  delete (filename) {
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

  read () {

  }
 
  getFileKey (file) {
    var keyOptions = this.options.fileKey
  
    if (keyOptions) {
      var getValue = function (obj) {
        return typeof obj === 'function' ? obj() : obj
      };
      var ext = path.extname(file.name)
      var name = path.basename(file.name, ext)
  
      if (keyOptions.safeString) {
        name = safeString(name)
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
}

module.exports = OssStore

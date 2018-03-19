# Ghost Aliyun OSS Storage

[![NPM version][npm-image]][npm-url]

[npm-image]: https://img.shields.io/npm/v/ghost-oss-store.svg?style=flat-square
[npm-url]: https://npmjs.org/package/ghost-oss-store

This [Ghost custom storage module](https://docs.ghost.org/docs/using-a-custom-storage-module#section-known-custom-storage-adapters) allows you to store media file with [Aliyun OSS](https://cn.aliyun.com/product/oss) instead of storing at local machine.

## Supported

- [x] 1.x
- [ ] 0.x

## Installation
  
### Via NPM

- Install Oss storage module

  ```
  npm install ghost-oss-store
  ```
  
- Make the storage folder if it doesn't exist yet

  ```
  mkdir -p content/adapters/storage
  ```
  
 - Create a script named "oss-store.js", content as follow:
 
 ```js
 //  content/adapters/storage/oss-store.js

module.exports = require('ghost-oss-store');
 ```

### Via Git

In order to replace the storage module, the basic requirements are:

- Create a new folder inside `/content` called `/storage`

- Clone this repo to `/storage`

  ```
  cd [path/to/ghost]/content/storage
  mkdir oss-store && cd oss-store
  git clone https://github.com/MT-Libraries/ghost-oss-store ./
  ```

- Install dependencies

  ```
  npm install
  ```

## Configuration

In your `config.js` file, you'll need to add a new `storage` block to whichever environment you want to change:

```javascript
storage: {
  active: 'oss-store',
  'oss-store': {
    accessKeyId: 'accessKeyId',
    accessKeySecret: 'accessKeySecret',
    bucket: 'bucket',
    region: 'oss-cn-hangzhou',
    origin: 'https://www.thonatos.com/', // if you have bind custom domain to oss bucket. or false             
    fileKey: {
      safeString: true, // use Ghost safaString util to rename filename, e.g. Chinese to Pinyin
      prefix: 'ghost/',  // { String } will be formated by moment.js, using `[]` to escape,
      suffix: '' // { String } string added before file extname.
    }
  }
}
```

## License

Read [LICENSE](LICENSE)

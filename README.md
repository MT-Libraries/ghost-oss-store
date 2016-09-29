# Ghost Aliyun Oss Storage

This [Ghost custom storage module](https://github.com/TryGhost/Ghost/wiki/Using-a-custom-storage-module) allows you to store media file with [Aliyun Oss](https://cn.aliyun.com/product/oss) instead of storing at local machine.

## Installation

### Via NPM

- Install Oss storage module

  ```
  npm install ghost-oss-store
  ```
  
- Make the storage folder if it doesn't exist yet

  ```
  mkdir content/storage
  ```
  
- Copy the module into the right location

  ```
  cp -vR node_modules/ghost-oss-store content/storage/oss-store
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
    'oss_store': {
        accessKeyId: 'accessKeyId',
        accessKeySecret: 'accessKeySecret',
        bucket: 'bucket',
        region: 'oss-cn-hangzhou',
        origin: 'https://www.thonatos.com/',                
        fileKey: {
            safeString: true, // use Ghost safaString util to rename filename, e.g. Chinese to Pinyin
            prefix: 'ghost/',  // {String | Function} will be formated by moment.js, using `[]` to escape,
            suffix: '' // {String | Function} string added before file extname.
        }
    }
}
```

## License

Read [LICENSE](LICENSE)
function _getStorageKeyName(key){
  return `github-improved.${key}`;
}

const LocalStoragePersistentData = {
  getPersistedProp(key){
    return new Promise((resolve, reject) => {
      var ret = localStorage[_getStorageKeyName(key)];
      switch(ret){
        case 'true':
          ret = true;
          break;
        case 'false':
          ret = false;
          break;
      }
      resolve(ret);
    });
  },
  setPersistedProp(key, value){
    return new Promise((resolve, reject) => {
      localStorage[_getStorageKeyName(key)] = value;
      resolve(value);
    });
  }
}


const ChromeStoragePersistentData = {
  getPersistedProp(key){
    return new Promise((resolve, reject) => {
      chrome.storage.sync.get(
        _getStorageKeyName(key),
        function(value) {
          resolve(value[_getStorageKeyName(key)]);
        }
      );
    });
  },
  setPersistedProp(key, value){
    return new Promise((resolve, reject) => {
      chrome.storage.sync.set(
        {
          [_getStorageKeyName(key)] : value
        },
        function() {
          resolve(value);
        }
      );
    });
  }
}


export{
  LocalStoragePersistentData,
  ChromeStoragePersistentData
}

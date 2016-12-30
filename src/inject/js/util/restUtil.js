import _ from 'lodash';

//
let auth_token;

const RestUtil = {
  // url, data (WILL BE IMPLEMENTED, config (NOT USED)
  setAuthToken: (input_auth_token) => auth_token = input_auth_token,
  get:  (url, data, config) => _makeRequest('GET', url, data, config),
  post: (url, data, config) => _makeRequest('POST', url, data, config)
};


function _makeRequest(method, url, data, config){
  var request = new Request(url, {
    method: method,
    mode: 'cors',
    redirect: 'follow',
    cache: "no-cache",
    credentials: "include",
    headers: new Headers(
      _.merge(
        {
          'Accept': 'application/vnd.github.v3+json',
          'Authorization': `token ${auth_token}`
          'User-Chrome-Client-Type': 'Github Improved'
        },
        config || {}
      )
    )
  });

  return new Promise((resolve, reject) => {
    let successCall = false;
    fetch(request).then(
      resp => {
        successCall = resp.ok;
        return resp.json();
      }
    ).then(
      respObject => {
        successCall ? resolve(respObject)
          : reject(respObject);
      }
    )
  });
}


export default RestUtil;

import _ from 'lodash';

//
let auth_token;

const RestUtil = {
  // url, data (WILL BE IMPLEMENTED, config (NOT USED)
  setAuthToken: (input_auth_token) => auth_token = input_auth_token,
  get:  (url, data, config) => _makeRequest('GET', url, data, config),
  post: (url, data, config) => _makeRequest('POST', url, data, config),
  pjax: (url) => {
    //push history state
    //only push sate if needed (url changed...)
    if(document.location.href !== url){
      history.pushState(null, null, url);
    }

    return _makePjaxRequest(
      url
    );
  }
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
          'Authorization': `token ${auth_token}`,
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
    ).catch(
      respObject => reject(respObject)
    )
  });
}




function _makePjaxRequest(url){
  const pjaxContainerSelector = '#js-repo-pjax-container, .context-loader-container, [data-pjax-container]';
  var request = new Request(url, {
    method: 'GET',
    mode: 'cors',
    redirect: 'follow',
    cache: "no-cache",
    credentials: "include",
    headers: new Headers(
      {
        'Accept': 'text/html',
        'X-PJAX': true,
        'X-PJAX-Container': pjaxContainerSelector
      }
    )
  });


  $('#js-pjax-loader-bar').addClass('is-loading');

  return new Promise((resolve, reject) => {
    let successCall = false;
    fetch(request).then(
      resp => {
        successCall = resp.ok;
        window.resp111 = resp;
        return resp.text();
      }
    ).then(
      respObject => {
        successCall ? resolve(respObject)
          : location.href = url;
      }
    ).catch(
      respObject => reject(respObject)
    )
  }).then( (data) => {
    const $pjaxContainer = $(pjaxContainerSelector);
    $pjaxContainer.html(data);

    //trigger pjax end event
    $(document).trigger('pjax:end');

    // remove it
    $('#js-pjax-loader-bar').removeClass('is-loading');
  });
}


//pop state...
window.onpopstate = function(event) {
  _makePjaxRequest(document.location);
};



export default RestUtil;

console.log('background page simple');

//                              /repos/:owner/:repo/pulls/:number
var owner= 'relateiq';
var repo = 'riq';
var pullRequestNumber = '6946';
var auth_token = '...';

var request = new Request(`https://api.github.com/repos/${owner}/${repo}/pulls/${pullRequestNumber}/commits`, {
  method: 'GET',
  mode: 'cors',
  redirect: 'follow',
  cache: "no-cache",
  credentials: "include",
  headers: new Headers({
    "Accept": "application/json",
    "Authorization": "token ${auth_token}",
    "Access-Control-Allow-Origin": "https://api.github.com, https://github.com"
  })
});

fetch(request).then(
  resp => {
    return resp.ok ? resp.json() : {};
  }
).then(
  resp => {
    console.error('stuffs', resp)
  }
)

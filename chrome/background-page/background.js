console.log('background page init...');

// function makeRequest(url, data){
//   //                              /repos/:owner/:repo/pulls/:number
//   var owner= 'relateiq';
//   var repo = 'riq';
//   var pullRequestNumber = '6946';
//   var auth_token = '...';

//   var url;
//   url = `https://api.github.com/repos/${owner}/${repo}/pulls/${pullRequestNumber}/commits`;
//   // url = `https://api.github.com/users/octocat/orgs`;
//   // url = `https://api.github.com`;
//   // url = `https://api.github.com/user?access_token=${auth_token}`
//   // url = `https://api.github.com/users/synle`;

//   var request = new Request(url, {
//     method: 'GET',
//     mode: 'cors',
//     redirect: 'follow',
//     cache: "no-cache",
//     credentials: "include",
//     headers: new Headers({
//       'Accept': 'application/vnd.github.v3+json',
//       'Authorization': `token ${auth_token}`
//     })
//   });

//   return new Promise((resolve, reject) => {
//     let successCall = false;
//     fetch(request).then(
//       resp => {
//         successCall = resp.ok;
//         return resp.json();
//       }
//     ).then(
//       respObject => {
//         successCall ? resolve(respObject)
//           : reject(respObject);
//       }
//     )
//   });
// }


// makeRequest().then(
//   resp => console.log('SUCCESS', resp),
//   resp => console.error('ERROR', resp)
// );

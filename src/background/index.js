console.log('background page init...');

// function makeRequest(url, data){
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

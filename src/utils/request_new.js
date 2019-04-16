import fetch from 'dva/fetch';
import { host } from '../constants';

const checkStatus = async response => {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  throw await response.json();
};

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request_new(url, options = { 'mode' :'no-cors'}) {
  const defaultOptions = {
    credentials: 'include',
  };
  const newOptions = { ...defaultOptions, ...options };
  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json; charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  return fetch(host + url, newOptions)
    .then(checkStatus)
    .then(response => {
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then(data => ({ data }))
    .catch(err => ({ err }));
}



// import fetch from 'dva/fetch';
// import { host } from '../constants';


// function parseJSON(response) {
//   return response.json();
// }

// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }

//   const error = new Error(response.statusText);
//   error.response = response;
//   throw error;
// }

// /**
//  * Requests a URL, returning a promise.
//  *
//  * @param  {string} url       The URL we want to request
//  * @param  {object} [options] The options we want to pass to "fetch"
//  * @return {object}           An object containing either "data" or "err"
//  */
// export default function request_new(url, options={'mode': 'no-cors'}) {
  
//   const headers = {
//     'Accept': 'application/json',
//     "Content-Type": "application/json"
//   };
//   options.headers = Object.assign(options.headers||{}, headers);
//   options.json && (options.body = JSON.stringify(options.json));
//   console.log("Api-Req: ", options)
//   return fetch(host+url, options)
//     .then(checkStatus)
//     .then(parseJSON)
//     .then(data => {
//       console.log("Api-Res:kkkk", data);
//       return{ data }
//     })
//     .catch(err => {
//       console.warn("Api-Res:", err);
//       return { err }
//     });
// }
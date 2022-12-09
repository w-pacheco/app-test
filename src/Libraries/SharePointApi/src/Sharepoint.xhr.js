/**
 * Sharepoint.xhr.js
 * @description Header definitions for REST Api calls to Microsoft SharePoint Site Collections.
 * @author Wilfredo Pacheco
 */

const Headers = {
    "GET": {
        "Content-Type": "application/json; charset=UTF-8",
        "Accept": "application/json; odata=verbose"
    },
    "POST": {
        "Content-Type": "application/json; odata=verbose",
        "Accept": "application/json; odata=verbose",
        "X-RequestDigest": null,
        "IF-MATCH":"*"
    },
    "PATCH": {
        "Content-Type": "application/json; odata=verbose",
        "Accept": "application/json; odata=verbose",
        "X-RequestDigest": null,
        "X-HTTP-Method": "MERGE",
        "IF-MATCH": "*"
    },
    "DELETE": {
        "Content-Type": "application/json; odata=verbose",
        "Accept": "application/json; odata=verbose",
        "X-RequestDigest": null,
        "X-HTTP-Method": "DELETE",
        "IF-MATCH": "*"
    }
}

export default {
    GetRequestDigest: apiRequestDigest,
    Post: apiPOST,
    Get: apiGET,
    Patch: null,
    Delete: null,
    Headers: Headers,
    method: 'xhr'
}

function apiRequestDigest(_url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", _url, true);
    xhr.onreadystatechange = function(){

        // In local files, status is 0 upon success in Mozilla Firefox
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            var status = xhr.status;
            if (status === 0 
            || (status >= 200 && status < 400))
            {
                if (!!callback) callback(xhr);
            }

            else {
                // Oh no! There has been an error with the request!
                console.info('Oh no! There has been an error with the request!');
            }
        }
    }
    xhr.setRequestHeader('Accept', 'application/json; odata=verbose');
    xhr.send();
}

function apiPOST(_url, request, callback){
    var xhr = new XMLHttpRequest();
    xhr.open("POST", _url, true);
    xhr.setRequestHeader('Content-Type', 'application/json; odata=verbose');
    xhr.setRequestHeader('Accept', 'application/json; odata=verbose');
    xhr.setRequestHeader('X-RequestDigest', window.requestDigest);
    xhr.onloadend = function(xhr){

        if(xhr.returnValue 
        && xhr.currentTarget.status === 201)
        {
            console.log('Error Report Status: ' + xhr.currentTarget.statusText);
        }

        else { 
            // console.log(xhr)
        }
    }
    xhr.send(JSON.stringify(request));
}

function apiGET(url, callback){
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.responseType = 'json';
    xhr.onreadystatechange = function(){
        
        /** In local files, status is 0 upon success in Mozilla Firefox */
        if (xhr.readyState === XMLHttpRequest.DONE)
        {
            var status = xhr.status;
            if (status === 0 
            || (status >= 200 && status < 400))
            {
                if (!!callback) callback(xhr.response);
                else return xhr.response;
            }

            else console.log(xhr);
        }
    }
    xhr.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhr.setRequestHeader('Accept', 'application/json; odata=verbose');
    xhr.send();
}

function ShowResponse(xhr){
    console.info(JSON.parse(xhr.response));
}
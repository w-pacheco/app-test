/**
 * Sharepoint.jQuery.js
 * @description Header definitions for REST Api calls to Microsoft SharePoint Site Collections.
 * @author Wilfredo Pacheco
 */

import ErrorMessage from './Component.ErrorMessages.js';
import Headers from './Component.Headers.js';
import { SiteCollectionUrl } from './Component.Settings.js';

let statusCode = {};
let beforeSend = function beforeSend(jqXHR, settings){
    console.info('sending | ' + this.type + ' | ' + this.url);
}

let error = function error(jqXHR, textStatus, errorThrown ){
    console.info(jqXHR, textStatus, errorThrown );
}

let complete = function complete(jqXHR, textStatus){
    console.info(textStatus + ' | ' + this.type + ' | ' + this.url);
}


export const method = 'jQuery';
export function setStatusCode(statusCodeOptions){
    statusCode = statusCodeOptions;
}

/** Request Digest; */
export const GetRequestDigest = function GetRequestDigest(Url){

    const url = `${Url || SiteCollectionUrl}/_api/contextinfo`;
    const method = 'POST';
    const dataType = 'json';
    const headers = Headers.REQUEST_DIGEST;

    return $.ajax({
        url,
        method,
        dataType,
        headers,
        statusCode,
    })
    .then(data => data.d.GetContextWebInformation.FormDigestValue)
    .catch(e => console.info(e));
}

/** GET Request; */
export const Get = function Get(url, data){

    if (!url) throw new Error('You are missing a URL from your GET request!');

    data = data || '';

    const method = 'GET';
    const contentType = 'json';
    const headers = Headers.GET;

    return $.ajax({
        url,
        method,
        contentType,
        data,
        headers,
        statusCode,
    });
}

/** POST Request; */
export const Post = function Post(url, data, RequestDigest){

    if (!url) throw new Error('The URL is missing or invalid!');
    if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);

    data = typeof(data) === 'string' ? 
    data : 
    JSON.stringify(data);

    const method = 'POST';
    const dataType = 'json';
    const headers = Object.assign(Headers.POST, {
        'X-RequestDigest': RequestDigest,
    });

    return $.ajax({
        url,
        method,
        dataType,
        data,
        headers,
        statusCode,
    });
}

/** PATCH Request; */
export const Patch = function Patch(url, data, RequestDigest, etag){

    if (!url) throw new Error('The URL is missing or invalid!');
    if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);

    data = typeof(data) === 'string' ? 
    data : 
    JSON.stringify(data);
    
    const method = 'POST';
    const dataType = 'json';
    const headers = Object.assign(Headers.PATCH, {
        'IF-MATCH': etag || '*',
        'X-RequestDigest': RequestDigest,
    });

    return $.ajax({
        url,
        method,
        dataType,
        data,
        headers,
        statusCode,
    });
}

/** DELETE Request; */
export const Delete = function Delete(url, RequestDigest){

    if (!url) throw new Error('The URL is missing or invalid!');
    if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);

    const method = 'DELETE';
    const headers = Object.assign(Headers.DELETE, {
        'X-RequestDigest': RequestDigest,
    });

    return $.ajax({
        url,
        method,
        headers,
        statusCode,
    });
}

/** RECYCLE Request; */
export const Recycle = function Recycle(url, RequestDigest){

    /** NOTE: The OData recycle() method has been added at the end at the request of the service owner; */
    return Delete(`${url}/recycle()`, RequestDigest);
}
/**
 * Sharepoint.fetch.js
 * @description Header definitions for REST Api calls to Microsoft SharePoint Site Collections.
 * @author Wilfredo Pacheco
 */

import * as ErrorMessage from './Component.ErrorMessages.js';
import Headers from './Component.Headers.js';
import { SiteCollectionUrl } from './Component.Settings.js';

const {
    MissingRequestDigest,
    InvalidURL,
} = ErrorMessage;

export const method = 'fetch';

/** Request Digest; */
export const GetRequestDigest = function GetRequestDigest(Url){

    Url = `${Url || SiteCollectionUrl}/_api/contextinfo`;

    const method = 'POST';
    const headers = Headers.REQUEST_DIGEST;

    return fetch(Url, {
        method,
        headers,
    })
    .then(data => data.json())
    .then(data => data.d.GetContextWebInformation.FormDigestValue);
}

/** GET Request; */
export const Get = function Get(Url, Options){

    if (!Url) throw new Error(InvalidURL);

    if (Options 
    && typeof Options === 'object')
    {
        Url = `${Url}?${
            Object.entries(Options)
            .map(e => `${e[0]}=${e[1]}`)
            .join('&')
        }`
    }

    const method = 'GET';
    const headers = Headers.GET;

    return fetch(Url , {
        method,
        headers,
    })
    .then(data => data.json())
    .then(data => data.d);
}

/** POST Request; */
export const Post = function Post(Url, data, RequestDigest){

    if (!Url) throw new Error(InvalidURL);
    if (!RequestDigest) throw new Error(MissingRequestDigest);
    
    data = typeof(data) === 'string' ? 
    data : 
    JSON.stringify(data);

    const method = 'POST';
    const headers = Object.assign(Headers.POST, {
        'X-RequestDigest': RequestDigest,
    });

    return fetch(Url, {
        method,
        body: data,
        headers,
    })
    .then(data => data.json());
}

/** PATCH Request; */
export const Patch = function Patch(Url, data, RequestDigest, etag){

    if (!Url) throw new Error(InvalidURL);
    if (!RequestDigest) throw new Error(MissingRequestDigest);

    data = typeof(data) === 'string' ? 
    data : 
    JSON.stringify(data);

    const method = 'POST';
    const headers = Object.assign(Headers.PATCH, {
        'IF-MATCH': etag || '*',
        'X-RequestDigest': RequestDigest,
    });

    return fetch(Url, {
        method,
        body: data, // body data type must match "Content-Type" header
        headers,
    });
}

/** DELETE Request; */
export const Delete = function DELETE(Url, RequestDigest){

    if (!Url) throw new Error(InvalidURL);
    if (!RequestDigest) throw new Error(MissingRequestDigest);

    const method = 'POST';
    const headers = Object.assign(Headers.DELETE, {
        'X-RequestDigest': RequestDigest,
    });
    
    return fetch(Url, {
        method,
        headers,
    });
}


/** RECYCLE Request; */
export const Recycle = function Recycle(Url, RequestDigest){    
    return Delete(`${Url}/recycle()`, RequestDigest);
}
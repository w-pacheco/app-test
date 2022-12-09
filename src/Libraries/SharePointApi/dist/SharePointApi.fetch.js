/**
 * SharePointApi.fetch.js
 * @build 2022.10.19
 * @description Used to call data using fetch & the Microsoft SharePoint REST API. 
 * Version 3.0
 * @author Wilfredo Pacheco
 */

(function(){

    // const TOKEN = '/SiteAssets';
    function SharePointApi(TOKEN = '/SiteAssets'){

        const { href } = location;
        const SiteCollectionUrl = href.split(TOKEN)[0];
        const mode = 'fetch';

        /** Error Messages; */
        const MissingHeaders = 'SharepointApi | Headers are not defined!';
        const MissingRequestDigest = 'SharepointApi | Request Digest is missing!';

        const ErrorMessage = {
            MissingHeaders,
            MissingRequestDigest,
        }

        /** Request Digest; */
        const GetRequestDigest = function GetRequestDigest(Url){

            const method = 'POST';
            const headers = { 
                'Accept': 'application/json; odata=verbose',
            }

            return fetch(`${Url || SiteCollectionUrl}/_api/contextinfo`, {
                method,
                headers,
            })
            .then(data => data.json())
            .then(data => data.d.GetContextWebInformation.FormDigestValue);
        }

        /** GET Request; */
        const Get = function Get(Url, Options){

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
            const headers = { 
                'Content-Type': 'application/json; charset=UTF-8', 
                'Accept': 'application/json; odata=verbose',
            }
    
            return fetch(Url , {
                method,
                headers,
            })
            .then(data => data.json())
            .then(data => data.d);
        }

        /** POST Request; */
        const Post = function Post(Url, data, RequestDigest){

            if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);
            
            data = typeof(data) === 'string' ? 
            data : 
            JSON.stringify(data);
    
            const HEADER = {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose',
                'X-RequestDigest': RequestDigest,
            };
    
            return fetch(Url, {
                method: 'POST',
                body: data,
                headers: HEADER,
            })
            .then(data => data.json());
        }

        /** PATCH Request; */
        const Patch = function Patch(Url, data, RequestDigest){

            if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);
    
            data = typeof(data) === 'string' ? 
            data : 
            JSON.stringify(data);
    
            const method = 'POST';
            const headers = {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose',
                'IF-MATCH': etag || '*',
                'X-HTTP-Method': 'MERGE',
                'X-RequestDigest': RequestDigest,
            };
    
            return fetch(Url, {
                method,
                body: data, // body data type must match "Content-Type" header
                headers,
            });
        }

        /** DELETE Request; */
        const Delete = function DELETE(Url, RequestDigest){
        
            if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);
    
            const method = 'POST';
            const headers = {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose',
                'IF-MATCH': '*',
                'X-HTTP-Method': 'DELETE',
                'X-RequestDigest': RequestDigest,
            };
            
            return fetch(Url, {
                method,
                headers,
            });
        }


        /** RECYCLE Request; */
        const Recycle = function Recycle(Url, RequestDigest){

            if (!Url || !ReqDigest) throw new Error('You are missing items from your DELETE request!');
            
            return Delete(`${Url}/recycle()`, RequestDigest);
        }

        this.GetRequestDigest = GetRequestDigest;
        this.Get = Get;
        this.Post = Post;
        this.Patch = Patch;
        this.Delete = Delete;
        this.Recycle = Recycle;
        this.ErrorMessage = ErrorMessage;
        this.SiteCollectionUrl = SiteCollectionUrl;
        this.mode = mode;

        this.Lists = {
            getByTitle(ListTitle, data){
                return Get(`${SiteCollectionUrl}/_api/Web/Lists/getByTitle('${ListTitle}')`, data);
            },
        }

        this.SiteGroups = {
            getById(Id, data){
                return Get(`${SiteCollectionUrl}/_api/Web/SiteGroups/getById(${Id})`, data);
            },
        }

        this.SiteUsers = {
            getById(Id, data){
                return Get(`${SiteCollectionUrl}/_api/Web/SiteUsers/getById(${Id})`, data);
            },
        }

        this.getWeb = function getWeb(Url, Options){
            return Get(Url || `${SiteCollectionUrl}/_api/Web`, Options);
        }

        return this;
    }

    window.SharePointApi = SharePointApi;

})();
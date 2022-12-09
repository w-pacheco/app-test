/**
 * SharePointApi.xhr.js
 * @build 2022.10.19
 * @description Used to call data using ajax & the Microsoft SharePoint REST API. 
 * Version 3.0
 * @author Wilfredo Pacheco
 */

(function(){

    // const TOKEN = '/SiteAssets';
    function SharePointApi(TOKEN = '/SiteAssets'){

        const { href } = location;
        const SiteCollectionUrl = href.split(TOKEN)[0];
        const mode = 'xhr';

        /** Error Messages; */
        const MissingHeaders = 'SharepointApi | Headers are not defined!';
        const MissingRequestDigest = 'SharepointApi | Request Digest is missing!';

        const ErrorMessage = {
            MissingHeaders,
            MissingRequestDigest,
        }

        const ParseJSON = function ParseJSON(xhr){
            console.info(JSON.parse(xhr.response));
        }

        /** Request Digest; */
        const GetRequestDigest = function GetRequestDigest(url, callback){
            var xhr = new XMLHttpRequest();
            xhr.open('POST', `${url || SiteCollectionUrl}/_api/contextinfo`, true);
            // FIXME: Do we need this here?
            // xhr.responseType = 'json';
            xhr.onreadystatechange = function onreadystatechange(){
        
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
                        console.warn('Oh no! There has been an error with the request!');
                        console.info(xhr);
                    }
                }
            }
            xhr.setRequestHeader('Accept', 'application/json; odata=verbose');
            xhr.send();
        }

        /** GET Request; */
        const Get = function Get(url, callback){
            var xhr = new XMLHttpRequest();
            xhr.open('GET', url, true);
            xhr.responseType = 'json';
            xhr.onreadystatechange = function onreadystatechange(){
                
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

        /** POST Request; */
        const Post = function Post(url, request, callback){
            var xhr = new XMLHttpRequest();
            xhr.open('POST', url, true);
            xhr.setRequestHeader('Content-Type', 'application/json; odata=verbose');
            xhr.setRequestHeader('Accept', 'application/json; odata=verbose');
            xhr.setRequestHeader('X-RequestDigest', window.requestDigest);
            xhr.onloadend = function onloadend(xhr){
        
                if(xhr.returnValue 
                && xhr.currentTarget.status === 201)
                {
                    console.log('Error Report Status: ' + xhr.currentTarget.statusText);
                }

                else if (xhr.currentTarget.status === 307)
                {
                    alert("Error 307 | The application needs to refresh.");
                    return location.reload();
                }
        
                else console.log(xhr);
            }
            xhr.send(JSON.stringify(request));
        }

        /** PATCH Request; */
        // const Patch = function Patch(Url, data, RequestDigest){

        //     if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);
    
        //     data = typeof(data) === 'string' ? 
        //     data : 
        //     JSON.stringify(data);
    
        //     const method = 'POST';
        //     const headers = {
        //         'Content-Type': 'application/json; odata=verbose',
        //         'Accept': 'application/json; odata=verbose',
        //         'IF-MATCH': etag || '*',
        //         'X-HTTP-Method': 'MERGE',
        //         'X-RequestDigest': RequestDigest,
        //     };
    
        //     return fetch(Url, {
        //         method,
        //         body: data, // body data type must match "Content-Type" header
        //         headers,
        //     });
        // }

        /** DELETE Request; */
        // const Delete = function DELETE(Url, RequestDigest){
        
        //     if (!RequestDigest) throw new Error(ErrorMessage.MissingRequestDigest);
    
        //     const method = 'POST';
        //     const headers = {
        //         'Content-Type': 'application/json; odata=verbose',
        //         'Accept': 'application/json; odata=verbose',
        //         'IF-MATCH': '*',
        //         'X-HTTP-Method': 'DELETE',
        //         'X-RequestDigest': RequestDigest,
        //     };
            
        //     return fetch(Url, {
        //         method,
        //         headers,
        //     });
        // }


        /** RECYCLE Request; */
        // const Recycle = function Recycle(Url, RequestDigest){

        //     if (!Url || !ReqDigest) throw new Error('You are missing items from your DELETE request!');
            
        //     const method = 'POST';
        //     const headers = {
        //         'Content-Type': 'application/json; odata=verbose',
        //         'Accept': 'application/json; odata=verbose',
        //         'IF-MATCH': '*',
        //         'X-HTTP-Method': 'DELETE',
        //         'X-RequestDigest': RequestDigest,
        //     };
            
        //     /** NOTE: The OData recycle() method has been added at the end at the request of the service owner; */
        //     return fetch(`${Url}/recycle()`, {
        //         method,
        //         headers,
        //     });
        // }

        this.GetRequestDigest = GetRequestDigest;
        this.Get = Get;
        this.Post = Post;
        // this.Patch = Patch;
        // this.Delete = Delete;
        // this.Recycle = Recycle;
        this.ErrorMessage = ErrorMessage;
        this.SiteCollectionUrl = SiteCollectionUrl;
        this.ParseJSON = ParseJSON;
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
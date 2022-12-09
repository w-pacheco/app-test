/**
 * SharePointApi.jQuery.js
 * @build 2022.10.19
 * @description Used to call data using the Microsoft SharePoint REST API, requires jQuery. 
 * Version 3.0
 * @author Wilfredo Pacheco
 */

(function(){
    
    // const TOKEN = '/SiteAssets';
    function SharePointApi(TOKEN = '/SiteAssets'){

        const { href } = location;
        const SiteCollectionUrl = href.split(TOKEN)[0];
        const mode = 'jQuery';

        /** Error Messages; */
        const MissingHeaders = 'SharepointApi | Headers are not defined!';
        const MissingRequestDigest = 'SharepointApi | Request Digest is missing!';

        const ErrorMessage = {
            MissingHeaders,
            MissingRequestDigest,
        }

        const statusCode = {
            307: function() {
                alert("Error 307 | The application needs to refresh.");
                return location.reload();
            }
        }

        /** Request Digest; */
        const GetRequestDigest = function GetRequestDigest(Url){

            const url = `${Url || SiteCollectionUrl}/_api/contextinfo`;
            const method = 'POST';
            const dataType = 'json';
            const headers = { 
                'Accept': 'application/json; odata=verbose',
            }

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
        const Get = function Get(url, data){

            if (!url) throw new Error('You are missing a URL from your GET request!');

            const method = 'GET';
            const contentType = 'json';
            data = data || '';
            const headers = { 
                'Content-Type': 'application/json; charset=UTF-8', 
                'Accept': 'application/json; odata=verbose',
            }

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
        const Post = function Post(url, data, ReqDigest){

            if (!url || !ReqDigest) throw new Error('You are missing items from your POST request!');

            const method = 'POST';
            const dataType = 'json';

            data = typeof(data) === 'string' ? 
            data : 
            JSON.stringify(data);

            const headers = {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose',
                'X-RequestDigest': ReqDigest,
            }

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
        const Patch = function Patch(url, data, ReqDigest, etag){

            if (!url || !ReqDigest) throw new Error('You are missing items from your PATCH request!');

            const method = 'POST';
            const dataType = 'json';

            data = typeof(data) === 'string' ? 
            data : 
            JSON.stringify(data);

            const headers = {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose',
                'IF-MATCH': etag || '*',
                'X-HTTP-Method': 'MERGE',
                'X-RequestDigest': ReqDigest,
            }

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
        const Delete = function Delete(url, ReqDigest){

            if (!url || !ReqDigest) throw new Error('You are missing items from your DELETE request!');

            const method = 'POST';
            const dataType = 'json';
            const headers = {
                'Content-Type': 'application/json; odata=verbose',
                'Accept': 'application/json; odata=verbose',
                'IF-MATCH': '*',
                'X-HTTP-Method': 'DELETE',
                'X-RequestDigest': ReqDigest,
            }

            return $.ajax({
                url,
                method,
                dataType,
                data,
                headers,
                statusCode,
            });
        }

        /** RECYCLE Request; */
        const Recycle = function Recycle(url, ReqDigest){

            if (!url || !ReqDigest) throw new Error('You are missing items from your DELETE request!');

            /** NOTE: The OData recycle() method has been added at the end at the request of the service owner; */
            return Delete(`${url}/recycle()`, ReqDigest);
        }

        this.GetRequestDigest = GetRequestDigest;
        this.Get = Get;
        this.Post = Post;
        this.Patch = Patch;
        this.Delete = Delete;
        this.Recycle = Recycle;
        this.ErrorMessage = ErrorMessage;
        this.SiteCollectionUrl = SiteCollectionUrl;
        // this.mode = $?.fn?.jquery;
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

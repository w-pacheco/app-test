/**
 * SharePointApi.js
 * @author Wilfredo Pacheco
 */

import Headers from './Component.Headers.js';
import * as SP_jQuery from './Sharepoint.jQuery.js';
import * as SP_Fetch from './SharepointApi.fetch.js';
import SP_Ajax from './Sharepoint.xhr.js';
import defaultOptions from './Component.DefaultOptions.js';
import * as Settings from './Component.Settings.js';
import WebTools from './Component.WebUtilities.js';
import Social from './Component.Social.js';
import { CreateSearchPayload, ProcessQueryPath } from './Component.ActiveDirectory.js';

const {
    Title,
    Version,
    Author,
    Copyright,
    WebPath,
    SiteCollectionUrl,
    AjaxMethods,
    isMethodAvailable,
} = Settings;

export default function SharepointApi(Options = {}){

    Options = Object.assign(defaultOptions, Options);

    const { verbose } = Options;
    const THIS = this;

    /** Display methods array in console; */
    if (verbose) console.table(AjaxMethods);
    // if (!SiteCollectionUrl) throw new Error('SharePointApi | The site collection URL is invalid!');

    if (Options.method === 'jQuery' && Options?.statusCode) SP_jQuery.setStatusCode(Options.statusCode);
    /** If jQuery is requested & available; */
    if (Options.method === 'jQuery' 
    && isMethodAvailable('jQuery')) Object.assign(this, SP_jQuery);

    /** If fetch is available && requested OR jquery is requested but not available; */
    else if (isMethodAvailable('fetch') 
    && Options.method === 'fetch' 
    || Options.method === 'jQuery' 
    && !isMethodAvailable('jQuery')) Object.assign(this, SP_Fetch);

    else if (Options.method === 'xhr' 
    || !isMethodAvailable('jQuery') && !isMethodAvailable('fetch'))
    {
        if (verbose) console.info('Use Ajax!');
        Object.assign(this, SP_Ajax);
    }

    /** Notify the user the method requested was not available, then assign what the app selected; */
    if (Options.method !== this?.method)
    {
        console.warn(`${Options.method} was not available, your requests will use: ${this?.method}!`);
        Options.method = this.method;
    }

    /** Details */
    this.Title = Title;
    this.Version = Version;
    this.Author = Author;
    this.Copyright = Copyright;

    /** Site Info */
    this.Options = Options;
    this.SiteCollectionUrl = SiteCollectionUrl;

    /** Components */
    this.Headers = Headers;

    /** This method is only available when using jQuery; */
    this.Social = this?.method === 'jQuery' ? 
    Social(SiteCollectionUrl, this) : 
    null;

    this.ActiveDirectory = {
        Search: function Search(queryString){
    
            /** Create query String; */
            const Payload = CreateSearchPayload(queryString);
    
            return THIS.GetRequestDigest()
            .then(RequestDigest => {
                return THIS.Post(`${SiteCollectionUrl + ProcessQueryPath}`, Payload, RequestDigest)
                .then(result => {
                    /** @return the result array; */
                    return JSON.parse(result[2]);
                });
            });
        }
    }

    this.getMethods = function getMethods(){
        return AjaxMethods;
    }

    this.showAvailableMethods = function showAvailableMethods(){
        return console.table(this.getMethods());
    }

    this.Lists = {
        getByTitle(ListTitle, data){
            if (!ListTitle) throw new Error('SharePointApi | Please use a valid list title!');
            return Get(`${SiteCollectionUrl}/_api/Web/Lists/getByTitle('${ListTitle}')`, data);
        },
    }

    this.SiteGroups = {
        getById(Id, data){
            if (!Id) throw new Error('SharePointApi | Please use a valid site group Id!');
            return Get(`${SiteCollectionUrl}/_api/Web/SiteGroups/getById(${Id})`, data);
        },
    }

    this.SiteUsers = {
        getById(Id, data){
            if (!Id) throw new Error('SharePointApi | Please use a valid site user Id!');
            return Get(`${SiteCollectionUrl}/_api/Web/SiteUsers/getById(${Id})`, data);
        },
    }

    this.getWeb = function getWeb(options, Url){
        
        /**
        * @param {Web} Holdes all application information
        * FirstUniqueAncestorSecurableObject:
        * RoleAssignments: List of all possible groups available in Sharepoint;
        * AllProperties:
        * AssociatedMemberGroup:
        * AssociatedOwnerGroup:
        * AssociatedVisitorGroup:
        * AvailableContentTypes:
        * AvailableFields:
        * ContentTypes:
        * CurrentUser: Details of user currently logged in;
        * EventReceivers:
        * Features:
        * Fields:
        * Folders: List of available folders from application root;
        * Lists: All available List (tables) in application;
        * ListTemplates:
        * Navigation:
        * ParentWeb: Details of application parent directory;
        * PushNotificationSubscribers: *Will break application if not defined and called;
        * RecycleBin: Collection of any deleted item, folder, list item, file, etc...;
        * RegionalSettings: User regional time settings;
        * RoleDefinitions: List of all roles/permissions and details available to a user;
        * RootFolder: Details for application root folder;
        * SiteGroups: All available groups in Sharepoint;
        * SiteUserInfoList:
        * SiteUsers: All available users in Sharepoint;
        * ThemeInfo: (self explanitory)
        * UserCustomActions:
        * Webs:
        * WebInfos:
        * WorkflowAssociations:
        * WorkflowTemplates:
        */

        options = options ? 
        options : 
        new Object();

        Url = Url ? 
        `${Url + WebPath}` : 
        `${SiteCollectionUrl + WebPath}`;

        return THIS.Get(Url, options)
        .then(data => Object.assign(data.d, WebTools));
    }

    console.info(`${
        this.constructor.name
    } | v${
        this.Version
    } | ${
        Options.method
    } | ${
        this.Copyright
    }`);

    return this;
}
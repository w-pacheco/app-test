/**
 * Download.js
 * @author Wilfredo Pacheco
 */

/*
Options = {
    Url: null, // Web.Url
    Folder: null, // ServerRelativeUrl
    folderDetailsLink: null, // ServerRelativeUrl
}

await App.Download({
    Url: `https://icenter.saic.com/sites/peess/main/Wil/TaskTracker`, // Web.Url
    Folder: '/sites/peess/main/Wil/TaskTracker/SiteAssets/MapMySite/', // ServerRelativeUrl
    folderDetailsLink: '/sites/peess/main/Wil/TaskTracker/SiteAssets/MapMySite', // ServerRelativeUrl
})
*/

import App, { Route, Web } from "../../app.js";
import { localhost } from "../../app.Settings.js";
import Component from "../Classes/Component.js";
// import Modal from "../Components/Modal.js";
// import CreateElement from "./Element.Create.js";

var xhr;
var CancelDownload;

export async function LoadFileRoser({ Options, UpdateText, UpdateProgress }){

    const FileRoster = new Array();

    UpdateText(`Loading Folder Details...`);

    function GetFolderDeatils(ServerRelativeUrl){
        
        const { origin } = location;

        const SiteCollectionURL = Options?.Url || Web.Url;
        const SiteCollectionServerRelativeURL = Options?.Folder || `${
            Web.ServerRelativeUrl
        }/SiteAssets/App/`;

        return Route.Get(`${
            SiteCollectionURL
        }/_api/Web/GetFolderByServerRelativeUrl('${
            ServerRelativeUrl
        }')`, {
            $select: '*',
            $expand: 'Files,Folders,ListItemAllFields,Properties,StorageMetrics',
            $expand: 'Files,Folders'
        })
        .then(data => {
            if (data.d.Files.results.length)
            {
                data.d.Files.results
                .map(f => {
                    const { ServerRelativeUrl } = f;
                    return {
                        Url: origin + ServerRelativeUrl,
                        Path: ServerRelativeUrl.replace(SiteCollectionServerRelativeURL, ''),
                    }
                })
                .forEach(file => FileRoster.push(file));
            }
            return data;
        }).catch(response => {
            console.info(response);
        });
    }

    var Count = 0;
    const SiteCollection = Options?.folderDetailsLink || `${Web.ServerRelativeUrl}/SiteAssets/App`;
    const FolderDetailsCall = xhr = GetFolderDeatils(SiteCollection);
    const Root = await FolderDetailsCall;

    for (const folder of Root.d.Folders.results)
    {
        Count++
        if (CancelDownload) return;
        const { ServerRelativeUrl } = folder;
        UpdateText(`Expanding ${Count} of ${Root.d.Folders.results.length} Folders`);
        const ListDetailsCall = xhr = GetFolderDeatils(ServerRelativeUrl);     
        const listDetails = await ListDetailsCall;
        listDetails?.d?.Folders?.results.forEach(f => Root.d.Folders.results.push(f));
    }
    
    console.info(`Directory Map Complete! | File Count: ${FileRoster.length} | Starting Download......`);
    // window.fileroster = FileRoster;
    return FileRoster;
}

export function FileCallResponse(response){

    const { 
        body,       // The body read-only property of the Response interface is a ReadableStream of the body contents.
        bodyUsed,   // The bodyUsed read-only property of the Response interface is a boolean value that indicates whether the body has been read yet.
        headers,    // The headers read-only property of the Response interface contains the Headers object associated with the response.
        ok,         // The ok read-only property of the Response interface contains a Boolean stating whether the response was successful (status in the range 200-299) or not.
        redirected, // The read-only redirected property of the Response interface indicates whether or not the response is the result of a request you made which was redirected.
        status,     // The status read-only property of the Response interface contains the HTTP status codes of the response.
        statusText, // The statusText read-only property of the Response interface contains the status message corresponding to the HTTP status code in Response.status.
        type,       // The type read-only property of the Response interface contains the type of the response.
        url         // The url read-only property of the Response interface contains the URL of the response. The value of the url property will be the final URL obtained after any redirects.
    } = response;

    if (ok)
    {
        const headerObj = new Object();
        Array
        .from([...headers])
        .map(h => {
            headerObj[h[0]] = h[1];
        });

        const ContentType = headerObj['content-type'];      /** Use the content-type to dentify files to return the as text; */
        if (ContentType.includes('text/')                   // Handles txt, html, aspx, and css;
        || ContentType.includes('/javascript')              // Handles javascript;
        || url.includes('.ignore')                          // Handles the gitignore if one is found;
        || url.includes('.md')) return response.text();     // Handles Markdown files;
        else return response.blob();                        /** All other files return as blob; */
    }
}

export default async function Download(Options){

    var Total,
        Count = 0;

    /** NOTE: JSZip has about a 5 gb limit; */
    const zip = new JSZip();
    window.zip = zip;

    // const modal = new Modal({
    //     parent: App.Main,
    //     large: true,
    //     title: 'Download',
    //     body: /*html*/`
    //     <p>Preparing Download...<p>
    //     <progress id="js-progressbar" class="uk-progress" value="0" max="100"></progress>`
    // }).Show();

    const UpdateText = function UpdateText(Str){
        console.info(Str);
        // modal?.Element?.querySelector('p').innerText = Str;
    }

    // const UpdateProgress = function UpdateProgress(value, element){
    //     element = modal.Element.querySelector('progress#js-progressbar');
    //     element.setAttribute('value', value);
    //     if (value >= 100) CreateElement({
    //         tag: 'p',
    //         parent: modal.Body,
    //         innerText: 'Done!'
    //     }).render();
    // }

    /** Handle local host; */
    if (localhost)
    {
        const fileroster = App.getApplicationFileRoster();
        const Files = fileroster.List.map(f => {
            const { Url } = f;
            const url = new URL(Url);
            f.Path = url.pathname.replace('/', '');
            return f;
        });

        Total = Files.length;
        Count = 0;

        for (const file of Files)
        {
            Count++
            UpdateText(`${Count} of ${Total} Files - ${file.Path}`);
            const SrcFileCall = xhr = fetch(file.Url)
            .then(FileCallResponse);

            const SrcFile = await SrcFileCall;
            zip.file(file.Path, SrcFile);
            // UpdateProgress(Count *( 100/Total ));
        }
    }

    /** Handle SharePoint site collection; */
    else
    {
        const fileroster = await LoadFileRoser({
            Options,
            UpdateText,
            // UpdateProgress,
        });

        Total = fileroster?.length ;
        Count = 0;

        fileroster?.sort(function byPath(a, b){
            return a.Path - b.Path;
        });

        if (CancelDownload) return;
        for (const file of fileroster)
        {
            if (CancelDownload) return;
            Count++
            UpdateText(`${Count} of ${Total} Files - ${file.Path}`);
            const SrcFileCall = xhr = fetch(file.Url)
            .then(FileCallResponse);
            const SrcFile = await SrcFileCall;
            zip.file(file.Path, SrcFile);
            // UpdateProgress(Count *( 100/Total ));
        }
    }

    zip.generateAsync({
        type:"blob"
    }).then(function(content) {
        if (CancelDownload) return;
        const url = URL.createObjectURL(content);
        return new Component({
            tag: 'a',
            attributes: [
                { name: 'href', value: url },
                { name: 'download', value: `${App.Name.split(' ').join('')}.zip` },
                { name: 'style', value: 'display: none !important;' },
            ],
            parent: document.body,
        })
        .render()
        .get()
        .click();
    });
}
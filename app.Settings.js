/**
 * app.Settings.js
 * @author Wilfredo Pacheco
 */

import AddMetaTags from './src/Actions/Metatags.Add.js';
import PerformanceMonitor, { FileRoster } from './src/Components/PerformanceMonitor.js';
import CreateElement from './src/Actions/Element.Create.js';
import CreateStyleSheetElement from './src/Actions/StyleSheet.Create.js';
import Download from './src/Actions/Download.js';

const { origin, hostname, port, pathname, href } = location;

export const CarePoint = hostname === 'carepoint.health.mil';
export const LaunchPad = hostname === 'info.health.mil';
export const localhost = hostname === '127.0.0.1' 
|| port === '8080' 
|| origin.includes('localhost');

export const Copyright = '(C) 2020-2022 SAIC';
export const Version = '1.0.0 (beta)';
export const Name = 'Template';
export const Icon = 'paint-bucket';
export const favicon = './images/uikit-favicon.png';

export const BoostrapVersion = window?.$?.fn?.tooltip?.Constructor?.VERSION;
export const jQueryVersion = window?.$?.fn?.jquery;

export const WebOptions = new Object();
WebOptions.$select = '*';
WebOptions.$expand = [
    'AllProperties',
    'CurrentUser',
    'Folders',
    'RootFolder',
    'Lists',
    'Lists/DefaultView',
    'Lists/Fields',
    'Lists/WorkflowAssociations',
    'RegionalSettings',
    'RegionalSettings/TimeZone',
    'RegionalSettings/TimeZones',
    'UserCustomActions',
    'WebInfos',
].join(',');

/** Handle CSS; */
export const DOMStyleSheets = [
    './src/CSS/colors.css',
    './src/CSS/style.css',
    './node_modules/bootstrap/dist/css/bootstrap.css',
    // './node_modules/pace-js/pace-theme-default.css',
    './src/CSS/loading-bar.css',
];

/** Handle scripts that don't support imports; */
export const DOMScripts = [
    './node_modules/jszip/dist/jszip.js',
    './node_modules/pdfmake/build/vfs_fonts.js',
];

export const SupportingFiles = [
    DOMStyleSheets,
    DOMScripts,
    [
        './app.aspx',
        './app.html',
        './README.md',
    ]
].flat();

/** Handle localhost - Used in Download.js */
if (localhost) SupportingFiles
.map(url => url.replace('.', origin))
.map(url => `== Resource[0] - ${url}`)
.forEach(fakeLog => performanceLog.push(fakeLog));

export default async function Settings(App){
    
    /** Add Meta Tags to the head Element; */
    AddMetaTags(Name, Version, Copyright);
    PerformanceMonitor({
        printToConsole: false,
        saveToDom: true,
    });

    /** Load all the libraries and CSS that we can't import; */
    DOMStyleSheets.forEach(href => CreateStyleSheetElement({
        href,
        parent: document.head,
    }).render());

    /** Dynamically load script files that do not have module exports; */
    await Promise.all(DOMScripts.map(file => {
        const value = file.split('/').pop().replace('.js', '');
        return fetch(file)
        .then(data => data.text())
        .then(content => {
            CreateElement({
                tag: 'script',
                attributes:[
                    { name: 'type', value: 'text/javascript' },
                    { name: 'data-file', value }
                ],
                parent: document.body,
                innerHTML: content
            }).render();
        });
    }));

    /** Listens for POST and GET calls for progress bar; */
    Pace.options.ajax.trackMethods = ['GET', 'POST'];

    /** Waits for the content element to load on the page before the loading bar disappears; */
    Pace.options.elements = { selectors: ['content'] };

    /** Link for site logo; */
    // const LogoPath = isDevMode ?
    // `node_modules/bootstrap-icons/icons/${Icon}.svg` :
    // `src/Libraries/Bootstrap-Icons/${Icon}.svg`;

    // const IconLink = './images/uikit-favicon.png';

    /** Handle logo for app.aspx and dev.aspx pages; */
    // const LogoURL = pathname.toLocaleLowerCase().includes('app.') ?
    // `${origin}${pathname.toLowerCase().replace(`app.${ext}`, LogoPath)}` :
    // `${origin}${pathname.toLowerCase().replace(`dev.${ext}`, LogoPath)}`;
    // const Logo = await fetch(LogoURL).then(data => data.text());

    // command prompt to turn on content editor for SP - 365
    // https://www.youtube.com/watch?v=ROsyzHiXmXc&t=268s

    /** Sets browser tab icon; */
    const BrowserIcon = CreateElement({
        tag: 'link',
        attributes: [
            { name: 'rel', value: 'shortcut icon' },

            /** Sets browser tab icon to an svg; */
            // { name: 'href', value: `data:image/svg+xml;utf8,${Logo.replace('currentColor', 'dodgerblue')}` },
            
            /** Sets browser favicon image; */
            { name: 'href', value: favicon },
            
            { name: 'type', value: 'image/vnd.microsoft.icon' },
            { name: 'id', value: 'favicon' },
        ],
    });

    /** Set page title; */
    document.title = Name;
    document.head.prepend(BrowserIcon);
    
    const getApplicationFileRoster = function getApplicationFileRoster(){
        return new FileRoster(App);
    }
    
    App.set('getApplicationFileRoster', getApplicationFileRoster)
    App.set('Download', Download);
    // ThemeSettings(App);
    // SetTheme(Theme);
}
/**
 * Component.Settings.js
 * @author Wilfredo Pacheco
 */

export const Title = 'SharePointApi';
export const Version = '3.0';
export const Author = 'Wilfredo Pacheco';
export const Copyright = '\u{00A9} 2020-2022 Wilfredo Pacheco';

export const WebPath = '/_api/Web';
export const UrlTokens = ['/App', '/SiteAssets', '/SitePages'];
export function getUrl(UrlTokens){
    const { href } = location;
    let NewUrl = null;
    UrlTokens.forEach(token => {
        if (href.includes(token)) NewUrl = location.href.split(token)[0];
    });
    return NewUrl;
}

export const SiteCollectionUrl = getUrl(UrlTokens);
export const AjaxMethods = [{ 
    /** AjaxMethods should ALWAYS be available; */
    Title: 'ajax',
    isAvailable: true,
}];

export const _jQuery = !!window?.$?.fn?.jquery; /** _jQuery is defined in the export; */
export const _Fetch = !!window?.fetch;          /** _Fetch is defined in the export; */

/** Add jQuery results; */
if (_jQuery) AjaxMethods.push({
    Title: 'jQuery',
    isAvailable: _jQuery,
});
else console.info('SharePointApi | jQuery not available!');

/** Add Fetch results; */
if (_Fetch) AjaxMethods.push({
    Title: 'fetch',
    isAvailable: _Fetch,
});
else console.info('SharePointApi | fetch not available!');

export function isMethodAvailable(queryString){
    return AjaxMethods.find(m => m.Title === queryString)?.isAvailable;
}
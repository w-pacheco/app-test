/**
 * Component.Headers.js
 * @description Header definitions for REST Api calls to Microsoft SharePoint Site Collections.
 * @author Wilfredo Pacheco
 */

/** Header Properties */
const Content_Type = 'Content-Type';
const Accept = 'Accept';
const X_RequestDigest = 'X-RequestDigest'
const X_HTTP_Method = 'X-HTTP-Method';
const IF_MATCH = 'IF-MATCH';
const DELETE = 'DELETE';

/** Header Values */
const charsetUTF8 = 'application/json; charset=UTF-8';
const verbose = 'application/json; odata=verbose';
const MERGE = 'MERGE';
const ASTERISK = '*';

/** GET Headers */
const SharepointGET_Headers = new Object();
SharepointGET_Headers[Content_Type] = charsetUTF8;
SharepointGET_Headers[Accept] = verbose;

/** POST Headers */
const SharepointPOST_Headers = new Object();
SharepointPOST_Headers[Content_Type] = verbose;
SharepointPOST_Headers[Accept] = verbose;
SharepointPOST_Headers[X_RequestDigest] = null;

/** PATCH Headers */
const SharepointPATCH_Headers = new Object();
SharepointPATCH_Headers[Content_Type] = verbose;
SharepointPATCH_Headers[Accept] = verbose;
SharepointPATCH_Headers[X_HTTP_Method] = MERGE;
SharepointPATCH_Headers[X_RequestDigest] = null;
SharepointPATCH_Headers[IF_MATCH] = ASTERISK;

/** DELETE Headers */
const SharepointDELETE_Headers = new Object();
SharepointDELETE_Headers[Content_Type] = verbose;
SharepointDELETE_Headers[Accept] = verbose;
SharepointDELETE_Headers[X_HTTP_Method] = DELETE;
SharepointDELETE_Headers[X_RequestDigest] = null;
SharepointDELETE_Headers[IF_MATCH] = ASTERISK;

/** REQUEST DIGEST Headers */
const SharepointREQUESTDIGEST_Headers = new Object();
SharepointREQUESTDIGEST_Headers[Accept] = verbose;

/** Header Object */
export default {
    GET: SharepointGET_Headers,
    POST: SharepointPOST_Headers,
    PATCH: SharepointPATCH_Headers,
    DELETE: SharepointDELETE_Headers,
    REQUEST_DIGEST: SharepointREQUESTDIGEST_Headers
}

// export function Post_Headers(RequestDigest){
//     this[Content_Type] = verbose;
//     this[Accept] = verbose;
//     this[X_RequestDigest] = RequestDigest;
//     return this;
// }
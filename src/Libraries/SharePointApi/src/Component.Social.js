/**
 * Component.Social.js
 * @description Used to define the user's social status on SharePoint, requires jQuery;
 * @author Wilfredo Paheco
 */

/**
 * Social
 * @param {string} SiteCollectionUrl Foot url;
 * @param {object} Route Method used to call REST Api;
 * @returns Object of methods used to get the user's social details;
 */
export default function Social(SiteCollectionUrl, Route){
    return {

        /** Sites & Documents; */
        getFollowing: function getFollowing(){
            return Route.Get(`${SiteCollectionUrl}/_api/social.following`)
            .then(data => data.d);
        },
        
        /** Get the people who are following the current user; */
        getFollowers: function getFollowers(){
            return Route.Get(`${SiteCollectionUrl}/_api/social.following/my/Followers`)
            .then(data => data.d);
        },
        
        /** Get the people who the current user is following; */
        getFollowed: function getFollowed(types){

            // User =       (ActorType = 0)
            // Document =   (ActorType = 1)
            // ----- the items below are disabled.....---------//
            // Site =       (ActorType = 2)
            // Tag =        (ActorType = 3)

            return Route.Get(`${
                SiteCollectionUrl
            }/_api/social.following/my/Followed(types=${
                types
            })`)
            .then(data => data.d);
        },
        
        /** Get the count of people who the current user is following; */
        getFollwedCount: function getFollwedCount(types){

            types = types ? 
            types : 
            1;

            return Route.Get(`${
                SiteCollectionUrl
            }/_api/social.following/my/FollowedCount(types=${
                types
            })`)
            .then(data => data.d);
        },

        /** Get the people who the current user might want to follow; */
        getSuggestions: function getSuggestions(){
            return Route.Get(`${SiteCollectionUrl}/_api/social.following/my/Suggestions`)
            .then(data => data.d);
        },

        /** Get the people who are following a particular user; */
        getFollwersFor: function getFollwersFor(account){
            /** @example: SharepointApi.Social.getFollwersFor('<domain>\\<first>.<last>') */
            return Route.Get(`${
                SiteCollectionUrl
            }/_api/sp.userprofiles.peoplemanager/getfollowersfor(accountName=@v)?@v='${
                account
            }'`)
            .then(data => data.d.results);
        },

        /** Finds out whether the People I'm Following list for the current user is public; */
        IsMyPeopleListPublic: function IsMyPeopleListPublic(){
            return Route.Get(`${
                SiteCollectionUrl
            }/_api/sp.userprofiles.peoplemanager/ismypeoplelistpublic`)
            .then(data => data.d);
        },

        init: function init(){
            return Promise.all([
                this.getFollowing(),
                this.getFollowers(),
                this.getFollwedCount(),
                this.IsMyPeopleListPublic(),
            ])
            .then(data => {
                return {
                    Following: data[0],
                    Followers: data[1],
                    FollowedCount: data[2],
                    IsMyPeopleListPublic: [3],
                }
            })
        },
    }
}
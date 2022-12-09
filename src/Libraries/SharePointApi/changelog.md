SharePointApi (changelog)
=========================

### Version 3.0
- Core functionality has been isolated in the dist folder for easy dynamic script imports and usage.
- Added new methods:
    - getWeb
    - ActiveDirectory.Search
    - List.getByTitle
    - SiteGroups.getById
    - SiteUsers.getById
- $harepointApi.js (support Internet Explorer) has been removed.

### Version 2.2  
- Restructure of components and isolating key functions.

### Build 2.20201217  
- Sharepoint.ie.js added to handle calls in Internet Explorer.

### Build 2.20200917
- SiteUser component added to call for site user information not available in the list call.

### Build 2.20200827
- Update includes PeoplePicker that directly queries Active Directory for site user accounts with missing email values.
- SharepointApi object was renamed from '_SharepointApi' along with the action calls:
    - postItem -> post
    - deleteItem -> delete
    - getByUrl -> get
    - patchItem -> patch
- All actions are logged on beforesend and when complete using jQuery for future development.
- All actions are broken down to allow easy integration when using fetch.
- All edit actions (POST/PATCH/DELETE) now require a request digest before header is created.
- Update includes Version Component.
- $harepointApi.js can be used along with jQuery to support Internet Explorer.
/**
 * Component.WebUtilities.js
 * @description Methods used to call items from the SharePoint Web Object;
 * @author Wilfredo Pacheco
 */

export default {

    /** Returns all lists available; */
    getAllLists: function getAllLists(){
        return this.Lists.results;
    },

    /** Returns an array of list objects; */
    getAllListTitles: function getAllListTitles(){
        return this.getAllLists().map(item => item.Title);
    },
    
    /** Returns list object by title; */
    // TODO: this would be cool if it took two variables, the property name, and the value in question;
    getListDetails: function getListDetails(listTitle){
        return this.getAllLists().find(item => item.Title === listTitle);
    },
    
    /** Returns list count number value; */
    getListCount: function getListCount(listTitle){
        return this.getListDetails(listTitle).ItemCount;
    },
    
    /** Returns all list items for requested listTitle; */
    getAllListItems: function getAllListItems(listTitle){
        const results = this.getAllLists().find(list => list.Title === listTitle).Items.results;
        return results ? results : new Array();
    },
    
    /** Returns list item object based on title and any key/value pair; */
    getListItem: function getListItem(listTitle, key, value){
        return this.getListDetails(listTitle).Items.results.find(item => item[key] === value);
    },
    
    /** Returns array of list item objects; */
    /** This should define forms for editing/creating list items; */
    getListItemFields: function getListItemFields(listTitle){
        return this.getListDetails(listTitle).Fields.results.filter(item => item.FromBaseType === false);
    },
    
    /** Returns the current user propery value from the web object if available; */
    getUser: function getUser(){
        return this.CurrentUser;
    },
}
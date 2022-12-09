/**
 * StyleSheet.Create.js
 * @author Wilfredo Pacheco
 */

// import CreateElement from "./Element.Create.js";
import Component from "../Classes/Component.js";

export default function CreateStyleSheetElement({href, parent}){
    return new Component({
        tag: 'link',
        attributes: [
            { name: 'rel', value: 'stylesheet' },
            { name: 'href', value: href },
            { name: 'data-file', value: href.split('/').pop().replace('.css', '') },
        ],
        parent,
    });
}
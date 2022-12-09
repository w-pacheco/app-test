/**
 * CreateElement.js
 * @author Wilfredo Pacheco
 * (C) 2020-2022 WP
 */

/**
 * @name CreateElement
 * @description This method uses document.createElement to return an element based on the arguments passed.
 * 
 * @param {Object} element Options defined by user to create a DOM element.
 * @returns Element object;
 */
export default function CreateElement(options, Element){

    if (!!Element 
    && !(Element instanceof HTMLElement)) throw new Error('The element passed is not valid!');
    
    const {
        tag, // String
        classList, // String
        attributes, // Array
        events, // Array
        customProperties, // Array;
    } = options;
    
    /** 
     * Create Element;
     * If a DOM element is passed in argument, it is super charged;
     */
    Element = Element instanceof HTMLElement ?
    Element : 
    document.createElement(tag);

    // Add classes;
    !!classList ? 
    Element.classList = classList : 
    '';

    // Add Element properties;
    !!attributes ? 
    attributes.forEach(function({ name, value }){
        Element.setAttribute(name, value);
    }) : 
    '';

    // Add Element events;
    !!events ? 
    events.forEach(function({ name, action }){
        Element.addEventListener(name, action);
    }) : 
    '';

    // Fill either the innerText or innerHTML;
    !!options.innerHTML ? 
    Element.innerHTML = options.innerHTML : 
    '';

    !!options.innerText ? 
    Element.innerText = options.innerText : 
    '';

    /**
     * @name SetCustomProperty 
     * @description Used to add custom properties and property values to element; 
     */
    const SetCustomProperty = function SetCustomProperty(prop, value){
        Element[prop] = value;
        return Element;
    }

    !!customProperties ? 
    customProperties.forEach(function({ prop, value }){
        SetCustomProperty(prop, value);
    }) : 
    '';

    Element.SetCustomProperty = SetCustomProperty;
    Element.setCustomProperty = SetCustomProperty;

    return Element;
}

export function CreateElementNode(element){

    const {
        tag,
        classList,
        attributes,
        events,
    } = element;

    const Element = document.createElementNS('http://www.w3.org/2000/svg', tag);

    // Add classes;
    !!classList ? 
    Element.classList = classList : 
    '';

    // Add Element properties;
    !!attributes ? 
    attributes.forEach(prop => Element.setAttribute(prop.name, prop.value)) : 
    '';

    // Add Element events;
    !!events ? 
    events.forEach(item => Element.addEventListener(item.name, item.action)) : 
    '';

    // Fill either the innerText or innerHTML;
    !!element.innerHTML ? 
    Element.innerHTML = element.innerHTML : 
    '';

    !!element.innerText ? 
    Element.innerText = element.innerText : 
    '';

    return Element;
}
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
    
    const message = new Error(); // Used to find caller;

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
    attributes.forEach(function({name, value}){
        Element.setAttribute(name, value);
    }) : 
    '';

    // Add Element events;
    !!events ? 
    events.forEach(function({name, action}){
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

    /** 
     * @name render
     * @description Used to render the element to the parent defined in the options or the parent passed; 
     * @returns Element object;
     */
    const render = function render(parent){

        // If a parent is passed in the argument and is and instanceof HTMLElement;
        if (!!parent 
        && parent instanceof HTMLElement) parent.append(Element);

        else if (!!options.parent 
        && options.parent instanceof HTMLElement) options.parent.append(Element);

        // else
        // {
            // console.info(Element);
            // console.info('%cCreate Element | Oops, Something went wrong!', 'color: gold;');
        // }

        return Element;
    }

    const getOriginalOptions = function getOriginalOptions(){
        return options;
    }

    /** 
     * @name getCallStack
     * @description Used to get caller information and help developers trouble shoot; 
     * @returns Array;
     */
    const getCallStack = function getCallStack(){
        
        const StackArray = message.stack.split(' '); // Split the string on the space;
        StackArray.shift(); // Remove the error string from the front of the array;

        /** Create a new array from the valid strings; */
        const CallerStack = StackArray.filter(str => !!str && str !== 'at').map(str => {
            str = str.trim().replace(/[()]/gi, '') // Replace the paren from the js file url;

            /** Return the end of the array which includes the file name, col no, line no; */
            if (str.includes('/')) return str.split('/').pop();

            /** Just return the string; */
            else return str;
        });

        /** @returns an filtered array of objects; */
        return CallerStack.map((str, index) => {
            if (!str.includes(':')) return {
                caller: str,
                file: CallerStack[index + 1],
                location: StackArray.find(str => str.includes(CallerStack[index + 1]))?.trim()?.replace(/[()]/gi, '')
            }            
        }).filter(item => !!item)
    }

    !!customProperties ? 
    customProperties.forEach(function({prop, value}){
        SetCustomProperty(prop, value);
    }) : 
    '';

    Element.SetCustomProperty = SetCustomProperty;
    Element.setCustomProperty = SetCustomProperty;
    Element.render = render;
    Element.getOriginalOptions = getOriginalOptions;
    Element.getCallStack = getCallStack;

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
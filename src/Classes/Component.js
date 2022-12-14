/**
 * Component.js
 * @author Wilfredo Pacheco
 */

import CreateElement from "../Actions/Element.Create.js";

class Component {

    constructor(arg) {
        
        if (!arg) throw new Error('Invalid request!');
        
        this.store = {
            callstack: new Error(),
        }

        /** If the instance of the argument is HTMLElement an element the options are set to null; */
        this.options = arg instanceof HTMLElement ? 
        null :
        arg;

        /** If the instance of the argument is HTMLElement an element is supercharged, else it is created; */
        this.Element = arg instanceof HTMLElement ? 
        CreateElement({}, arg) :
        CreateElement(arg);

        /** This will set the DOM element with the component instance; */
        this.Element.component = this;
        this.Element.setAttribute('component', '');

    }

    /**
     * render
     * @param {Object} parent is the element this will be appended to
     * @returns component
     */
    render(parent){

        /** If a parent is passed in the argument and is and instanceof HTMLElement; */
        if (!!parent 
        && parent instanceof HTMLElement) parent.append(this.Element);

        else if (!!this.options.parent 
        && this.options.parent instanceof HTMLElement) this.options.parent.append(this.Element);
        // else
        // {
        // console.info(Element);
        // console.info('%cCreate Element | Oops, Something went wrong!', 'color: gold;');
        // }
        return this;
    }

    /** @reference https://developer.mozilla.org/en-US/docs/Web/API/Element/remove */
    remove(){
        return this.Element.remove();
    }

    get(arg){
        if (arg) return this.Element.querySelector(arg);
        else return this.Element;
    }

    getCallStack(){
        return this.Element.getCallStack();
    }

    getOriginalOptions(){
        return this.options;
    }

    getCallStack(){
        
        const StackArray = this.store.callstack.stack.split(' '); // Split the string on the space;
        StackArray.shift(); // Remove the error string from the front of the array;

        /** Create a new array from the valid strings; */
        const CallerStack = StackArray
        .filter(str => !!str && str !== 'at')
        .map(str => {

            str = str.trim().replace(/[()]/gi, ''); // Replace the paren from the js file url;

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
                location: StackArray
                .find(str => str.includes(CallerStack[index + 1]))
                ?.trim()
                ?.replace(/[()]/gi, ''),
            }            
        }).filter(item => !!item);
    }

}

export default Component;
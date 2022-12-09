/**
 * Form.js
 * @author Wilfredo Pacheco
 */

import Component from "./Component.js";
import Fields from './Fields.js';
import Values from "./Values.js";

class Form extends Component {

    constructor(options){

        // By default auto-toggle for date and time fields are set to true;
        const autotoggle = options?.autotoggle || true;

        super(Object.assign(options, {
            // Since this is a form constructor, we will always set this for the user;
            tag: 'form',
            autotoggle,
        }));

        this.Fields = new Fields(this.Element);
        this.Values = new Values(this.Fields);

        /** Auto-Toggle picker for date and time elements when user focuses; */
        if (autotoggle) [
            Array.from(this.Element.querySelectorAll('input[type="date"]')),
            Array.from(this.Element.querySelectorAll('input[type="time"]')),
        ]
        .flat()
        .map(el => {
            el.addEventListener('focus', function ShowPicker(event){
                return this.showPicker();
            });
            return el;
        });

    }
}

export default Form;
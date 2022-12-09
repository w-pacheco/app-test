/**
 * Form.Fields.js
 * @author Wilfredo Pacheco
 */

class Fields {

    constructor (Element){
        this.Element = Element;
    }

    querySelector(queryString){
        return this.Element.querySelector(queryString);
    }

    get(arg){
        const fields = [
            Array.from(this.Element), 
            Array.from(this.Element.querySelectorAll('div[contenteditable="true"]')),
        ]
        .flat();

        if (!arg) return fields;
        else return fields.querySelector(arg);
    }

    /**
     * focus
     * @description By default the method will focus on the first field.
     * @param {String} arg string name of the field to focus on.
     */
    focus(arg){
        const fields = this.get();
        if (!arg && fields.length) fields[0].focus();
    }

    validate(){
        if (this.Element.checkValidity() === false)
        {
            this.Element.classList.add('was-validated');
            Array.from(this.Element)
            .map(el => {
                const {
                    badInput,
                    customError,
                    patternMismatch,
                    rangeOverflow,
                    rangeUnderflow,
                    stepMismatch,
                    typeMismatch,
                    tooLong,
                    tooShort,
                    // valid,
                    valueMissing,
                } = el.validity;
                const validity_state = {
                    badInput,
                    customError,
                    patternMismatch,
                    rangeOverflow,
                    rangeUnderflow,
                    stepMismatch,
                    typeMismatch,
                    tooLong,
                    tooShort,
                    // valid,
                    valueMissing,
                }

                Object.entries(validity_state)
                .forEach(item => {
                    try {
                        const value = item[1];
                        if (value) el.parentNode.querySelector('div.invalid-feedback').innerText = `${
                            camelcaseToSentenceCaseText(item[0])
                        }!`;
                    }
                    catch(e) {}
                });
            });
        }

        return this.Element.checkValidity();
    }
}

export default Fields;
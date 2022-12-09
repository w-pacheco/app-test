/**
 * Values.js
 * @author Wilfredo Pacheco
 */

class Values {

    constructor (Fields){
        this.Fields = Fields;
    }

    set(arg){
        const fields = this.Fields;
        if (!arg) throw new Error('App | Form | arg is missing!');
        for (const el of fields.get())
        {
            const name = el.getAttribute('name');
            const date = el.getAttribute('type') === 'date';
            const contenteditable = el.getAttribute('contenteditable') === 'true';
            
            /** If the element field has a name attribute & arg holds a value; */
            if (name && arg[name]) el.value = arg[name];
            if (name && contenteditable) el.innerHTML = arg[name];
            
            /** If the isDateField & the arg holds a value; */
            if (date && arg[name])
            {
                const _date = new Date(arg[name])
                .toLocaleString('en-US', {
                    timeZone: 'UTC',
                });

                el.value = new Date(_date).toISOString().split('T')[0];
            }
        }
    }

    get(){
        const fields = this.Fields;
        console.info(fields);
        const values = new Object();
        for (const el of fields.get())
        {
            const name = el.getAttribute('name');
            const date = el.getAttribute('type') === 'date';
            const contenteditable = el.getAttribute('contenteditable') === 'true';
            // const search = el.getAttribute('type') === 'search';
            if (name)
            {
                if (el.value !== '') values[name] = el.value;
                if (contenteditable) values[name] = el.innerHTML;
                if (date && el.value !== '') values[name] = new Date(el.value).toISOString();
            }
        }
        return values;
    }
}

export default Values;
/**
 * Report.js
 * @author Wilfredo Pacheco
 */

// https://sharepoint.stackexchange.com/questions/240706/rest-api-to-get-sharepoint-version
// SharePoint 2010 = 14.x, SharePoint 2013 = 15.x and SharePoint 2016 = 16.x
export const SharePointVersions = {
    0: 'SharePoint XXXX',
    14: 'SharePoint 2010',
    15: 'SharePoint 2013',
    16: 'SharePoint 2016',
}

/**
 * @desc FieldTypeKind for SharePoint
 *  
 * @type {FieldTypeKind} - 2 (Single Line of Text)
 * @type {FieldTypeKind} - 3 (Mulitiple Lines of Text)
 * @type {FieldTypeKind} - 4 (Date)
 * @type {FieldTypeKind} - 6 (Choice)
 * @type {FieldTypeKind} - 7 (Lookup)
 * @type {FieldTypeKind} - 9 (Number)
 * @type {FieldTypeKind} - 20 (Person or Group)
 * 
 */
 export const FieldTypeKindDetails = {
    2: 'Single Line of Text',
    3: 'Mulitiple Lines of Text',
    4: 'Date',
    6: 'Choice',
    7: 'Lookup',
    9: 'Number',
    // 10: 'Image',
    // 11: 'Currency',
    20: 'Person or Group',
}

export function getListTable(Lists){
    const pdfTable = [
        ['Title', 'BaseTemplate', 'ItemCount'],
    ];

    Lists
    ?.filter(l => !l.NoCrawl)
    .forEach((l, index) => {
        const {
            Title,
            BaseTemplate,
            ItemCount,
        } = l;
        return pdfTable.push([
            Title,
            BaseTemplate,
            ItemCount,
        ]);
    });

    return pdfTable;
}

export function getListDetailedView({Fields}){
    const body = [
        ['Title', 'FieldTypeKind', 'Required', 'ReadOnlyField', 'EnforceUniqueValues'],
    ];
    const FilteredFields = Fields.results
    .filter(f => !!f.CanBeDeleted);
    FilteredFields.forEach((f, index) => {
        const {
            Title,
            FieldTypeKind,
            Required,
            ReadOnlyField,
            EnforceUniqueValues,
        } = f;
        return body.push([
            Title,
            `(${FieldTypeKind}) ${FieldTypeKindDetails[FieldTypeKind]}`,
            Required,
            ReadOnlyField,
            EnforceUniqueValues,
        ]);
    });
    return {
        widths: [125, '*', 50, 75, '*'],
        body,
    }
}

export default function Report(Web){

    const {
        AllProperties,
        Folders,
        Lists,
        Title,
        WebInfos,
        Url,
        UserCustomActions,
    } = Web;
    
    const content = [];
    const coverpage = {
        stack: [{
            image: 'DHA_Logo', 
            width: 120,
            // margin: [left, top, right, bottom]
            margin: [0, 5, 0, 20],
        },{
            text: 'Defense Health Agency (DHA)\n\nStrategy, Plans, and Analytics (J-5 Directorate)', 
            style: 'subheader',
            margin: [0, 10, 0, 0],
        },{
            text: `${Title}\n\nSite Collection Schema Documentation\n\n\n\n\n${
                new Date().toLocaleString('en-US', {
                    year: "numeric",
                    month: "long",
                })
            }`,
            style: 'subheader',
            margin: [0, 30],
        }],
        style: 'header',
        pageBreak: 'after',
    }
    content.push(coverpage);

    const FilteredLists = Lists?.results
    .filter(l => !l.NoCrawl)
    .filter(l => !l.IsPrivate)
    .filter(l => !l.Title.includes('MicroFeed'));



    /** Start - Summary Page; */
    const version = AllProperties ? Number(AllProperties.vti_x005f_extenderversion.split('.')[0]) : 0;
    content.push({
        text: 'SharePoint Site Collection Details',
        style: 'subheader',
    });

    content.push({
        text: `This application is hosted on ${
            SharePointVersions[version]
        } (${
            AllProperties?.vti_x005f_extenderversion || '00.0.0.0000'
        })\n\nURL: ${
            Url
        }\nLists: ${
            FilteredLists?.length || 0
        }\nDocument Libraries: ${
            Folders?.results.length || 0
        }\nSubSites: ${
            WebInfos?.results.length || 0
        }\n\nThe table below displays a combination of lists and document libraries created both by Microsoft SharePoint upon site creation and by this application.`,
        margin: [0, 10, 0, 0],
    });
    /** End - Summary Page; */



    /** Start - Lists Table; */
    content.push({
        text: 'SharePoint Site Collection Lists',
        style: 'tableheader',
    });

    content.push({
        pageBreak: 'after',
        table: {
            widths: [250, 100, 100],
            body: getListTable(FilteredLists),
        }
    });
    /** End - Lists Table; */



    /** Start - List Schema Pages; */
    // const FilteredLists = Lists?.results
    // .filter(l => !l.NoCrawl)
    // .filter(l => !l.Title.includes('MicroFeed'))
    // .filter(l => !l.Title.includes('fpdatasources'));

    function byEnabled(wf){
        if (wf.Enabled) return wf;
    }

    FilteredLists
    ?.forEach(function(list, index){

        const {
            Title,
            Description,
            WorkflowAssociations,
        } = list;

        /** Page Header; */
        content.push({ text: Title, style: 'tableheader' });

        /** List Description; */
        content.push({
            text: Description || 'Description N/A',
            margin: [0, 10],
        });

        const workflows = WorkflowAssociations
        ?.results
        ?.filter(byEnabled);

        /** List Schema; */
        content.push({ table: getListDetailedView(list) });

        content.push({
            text: `${Title} Workflows: ${workflows.length}`,
            style: 'tableheader',
        });

        const workflowContent = {
            table: {
                // widths: [250, 100],
                body: [
                    // ['Id', 'Name', 'Description'],
                    ['Name', 'Description'],
                ]
            },
        }

        workflows.forEach(wf => {
            const { Id, Name, Description } = wf;
            // workflowContent.table.body.push([Id, Name, Description]);
            workflowContent.table.body.push([Name, Description]);
        });

        if (workflows.length) content.push(workflowContent);
        if ((index + 1) < FilteredLists.length) content.push({
            text: '',
            pageBreak: 'after',
        });
    });
    /** End - List Schema Pages; */


    /** Start - UserCustomActions */
    if (UserCustomActions.results.length)
    {
        content.push({
            text: '',
            pageBreak: 'before',
        });

        content.push({
            text: 'SharePoint Site Collection Custom User Actions',
            style: 'subheader',
        });

        const customuseractions = {
            table: {
                body: [
                    ['Title', 'Sequence', 'ScriptSrc'],
                ]
            },
        }

        UserCustomActions.results
        .forEach(function({ Title, ScriptSrc, Sequence }){
            customuseractions.table.body.push([Title, ScriptSrc, Sequence]);
        });

        content.push(customuseractions);
    }
    /** Endt - UserCustomActions */



    const images = {
        DHA_Logo: `data:image/png;base64,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`
    }

    this.content = content;
    this.coverpage = coverpage;
    this.Web = Web;
    this.images = images;

    /** Default Styles; */
    this.defaultStyle = {
        fontSize: 11,
        margin: 20,
    }

    /** Custom Styles; */
    this.styles = {
        header: {
            bold: true,
            alignment: 'center',
    
            // margin: [left, top, right, bottom]
            margin: [0, 120, 0, 80],
        },
        tableheader: {
            bold: true,
            margin: [0, 20, 0, 10],
        },
        subheader: { bold: true },
        quote: { italics: true },
        small: { fontSize: 8 },
    }

    return this;
}
import * as stmnts from './statements';
import { clean } from '../tools/tools.js';

async function exportClasses(client) {
    const {
        rows: classes
    } = await client.query(stmnts.classes);
    const {
        rows: attributes
    } = await client.query(stmnts.attributes);
    const {
        rows: classattributes
    } = await client.query(stmnts.classAttributes);
    return analyzeAndPreprocess(classes, attributes, classattributes);
}

function analyzeAndPreprocess(classes, attributes, classattributes) {
    let classAttrsPerTable = new Map(); {
        for (let ca of classattributes) {
            let currentCAs = classAttrsPerTable.get(ca.table);
            if (!currentCAs) {
                currentCAs = {};
                classAttrsPerTable.set(ca.table, currentCAs);
            }
            currentCAs[ca.key] = ca.value;
        }
    }

    let attrsPerTable = new Map();
    for (let a of attributes) {
        let tableAttributes = attrsPerTable.get(a.table);
        if (!tableAttributes) {
            tableAttributes = [];
            attrsPerTable.set(a.table, tableAttributes);
        }


        // clean up

        delete a.table;
        if (a.field === a.name) {
            delete a.name;
        }

        if (a.cidsType !== null) {
            delete a.dbType;
            delete a.precision;
            delete a.scale;
            if (a.foreignKeyTableId < 0) {
                delete a.cidsType;
                delete a.optional;
                delete a.manyToMany;
            } else if (a.isArrray === true) {
                delete a.cidsType;
                delete a.optional;
                delete a.oneToMany;
            } else {
                delete a.oneToMany;
                delete a.manyToMany
            }
        } else {
            delete a.cidsType;
            delete a.oneToMany;
            delete a.manyToMany
        }

        if (a.mandatory === false) {
            delete a.mandatory;
        }

        if (a.hidden === false) {
            delete a.hidden;
        }
        if (a.indexed === false) {
            delete a.indexed;
        }
        if (a.substitute === false) {
            delete a.substitute;
        }
        if (a.extension_attr === false) {
            delete a.extension_attr;
        }

        //remove all fields that are not needed anymore
        delete a.foreign_key;
        delete a.foreignKeyTableId;
        delete a.foreignkeytable; // check whether this should better be used instead of tc.table_name
        delete a.isArrray;

        //finally remove all field that are null
        clean(a);

        tableAttributes.push(a);
    }

    for (let c of classes) {
        //clean up
        if (c.table === c.name) {
            delete c.name;
        }
        if (c.descr === null) {
            delete c.descr;
        }
        if (c.indexed === false) {
            delete c.indexed;
        }

        if (c.classIcon === c.objectIcon) {
            c.icon = c.classIcon;
            delete c.classIcon;
            delete c.objectIcon;
        } else {
            delete c.icon;
        }
        if (c.array_link === false) {
            delete c.array_link;
        }
        if (c.policy === null) {
            delete c.policy;
        }
        if (c.attribute_policy === null) {
            delete c.attribute_policy;
        }

        //toString
        if (c.toStringType !== null && c.toStringClass != null) {
            c.toString = {
                type: c.toStringType,
                class: c.toStringClass
            };
        }
        delete c.toStringType;
        delete c.toStringClass;
        //editor
        if (c.editorType !== null && c.editorClass != null) {
            c.editor = {
                type: c.editorType,
                class: c.editorClass
            };
        }
        delete c.editorType;
        delete c.editorClass;
        //renderer
        if (c.rendererType !== null && c.rendererClass != null) {
            c.renderer = {
                type: c.rendererType,
                class: c.rendererClass
            };
        }
        delete c.rendererType;
        delete c.rendererClass;

        //add attributes
        let attrs = attrsPerTable.get(c.table);
        if (attrs) {
            c.attributes = attrs;
        }

        //add class attributes
        let cattrs = classAttrsPerTable.get(c.table);
        if (cattrs) {
            c.additionalAttributes = cattrs;
        }

    }
    return { classes, attributes };
}

export default exportClasses;
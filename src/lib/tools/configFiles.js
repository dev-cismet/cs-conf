import fs from 'fs';
import util from 'util';
import stringify from 'json-stringify-pretty-compact';
import { extname } from 'path';
import * as constants from './constants.js';
import { logVerbose } from './tools';

export function readConfigFile(file, sub) {    
    logVerbose(util.format("%s config file '%s'", sub ? " ↳ reading" : "sReading", file));
    return fs.existsSync(file) ? JSON.parse(fs.readFileSync(file, {encoding: 'utf8'})) : []
}

export function readConfigFiles(configDir, topics) {
    logVerbose(util.format("Reading config directory '%s' ...", configDir));
    if (!fs.existsSync(configDir)) {
        throw util.format("readConfigFiles: %s does not exist", configDir);
    }

    let domains = topics == null || topics.includes("accessControl") ? readConfigFile(util.format("%s/domains.json", configDir), true) : null;
    let usergroups = topics == null || topics.includes("accessControl") ? readConfigFile(util.format("%s/usergroups.json", configDir), true) : null;
    let usermanagement = topics == null || topics.includes("accessControl") ? readConfigFile(util.format("%s/usermanagement.json", configDir), true) : null;
    let xmlFiles = new Map();
    if (topics == null || topics.includes("accessControl")) {
        let confAttrXmlSnippetsFolder = util.format("%s/%s", configDir, constants.confAttrXmlSnippetsFolder);
        if (fs.existsSync(confAttrXmlSnippetsFolder)) {
            for (let file of fs.readdirSync(confAttrXmlSnippetsFolder)) {
                if (extname(file) == ".xml") {
                    xmlFiles.set(file, fs.readFileSync(util.format("%s/%s", confAttrXmlSnippetsFolder, file), {encoding: 'utf8'}));    
                }
            }    
        }
    }

    let policyRules = topics == null || topics.includes("classes") ? readConfigFile(util.format("%s/policyRules.json", configDir), true) : null;
    let classPerms = topics == null || topics.includes("classes") ? readConfigFile(util.format("%s/classPerms.json", configDir), true) : null;
    let attrPerms = topics == null || topics.includes("classes") ? readConfigFile(util.format("%s/attrPerms.json", configDir), true) : null;
    let classes = topics == null || topics.includes("classes") ? readConfigFile(util.format("%s/classes.json", configDir), true) : null;
    let sync = topics == null || topics.includes("classes") ? readConfigFile(util.format("%s/sync.json", configDir), true) : null;

    let structure = topics == null || topics.includes("structure") ? readConfigFile(util.format("%s/structure.json", configDir), true) : null;
    let dynchildhelpers = topics == null || topics.includes("structure") ? readConfigFile(util.format("%s/dynchildhelpers.json", configDir), true) : null;

    let structureSqlFiles=new Map();
    let helperSqlFiles=new Map();

    if (topics == null || topics.includes("structure")) {
        let structureDynamicChildrenFolder = util.format("%s/%s", configDir, constants.structureDynamicChildrenFolder);
        if (fs.existsSync(structureDynamicChildrenFolder)) {
            for (let file of fs.readdirSync(structureDynamicChildrenFolder)) {
                if (extname(file) == ".sql") {
                    structureSqlFiles.set(file, fs.readFileSync(util.format("%s/%s", structureDynamicChildrenFolder, file), {encoding: 'utf8'}));    
                }
            }    
        }

        let structureHelperStatementsFolder = util.format("%s/%s", configDir, constants.structureHelperStatementsFolder);
        if (fs.existsSync(structureHelperStatementsFolder)) {
            for (let file of fs.readdirSync(structureHelperStatementsFolder)) {
                if (extname(file) == ".sql") {
                    helperSqlFiles.set(file, fs.readFileSync(util.format("%s/%s", structureHelperStatementsFolder, file), {encoding: 'utf8'}));    
                }
            }    
        }
    }

    return {
        domains, 
        policyRules, 
        usergroups, 
        usermanagement, 
        classes, 
        classPerms, 
        attrPerms, 
        structure, 
        dynchildhelpers,
        xmlFiles,
        structureSqlFiles,
        helperSqlFiles,
        sync
    }
}

export function checkConfigFolders(configDir, overwrite = false) {
    if (fs.existsSync(configDir) && !overwrite) {
        throw util.format("checkConfigFolders: %s exists already", configDir);
    }
}

export function writeConfigFiles(config, configDir, overwrite = false) {
    let {
        domains,
        policyRules,
        usermanagement,
        usergroups,
        classes,
        classPerms,
        attrPerms,
        structure,
        dynchildhelpers,
        structureSqlFiles,
        helperSqlFiles,
        xmlFiles
    } = config;

    let confAttrXmlSnippetsFolder = util.format("%s/%s", configDir, constants.confAttrXmlSnippetsFolder);
    let structureDynamicChildrenFolder = util.format("%s/%s", configDir, constants.structureDynamicChildrenFolder);
    let structureHelperStatementsFolder = util.format("%s/%s", configDir, constants.structureHelperStatementsFolder);

    // create configDir structure

    if (fs.existsSync(configDir) && overwrite) {
        //fs.rmSync(configDir, { recursive: true, force: true }) // DANGER!!!
    }
    if (!fs.existsSync(configDir)) {
        fs.mkdirSync(configDir);
    }

    if (fs.existsSync(confAttrXmlSnippetsFolder)) {
        fs.rmSync(confAttrXmlSnippetsFolder, { recursive: true, force: true });
    }
    if (xmlFiles.size > 0) {
        fs.mkdirSync(confAttrXmlSnippetsFolder);
    }

    if (fs.existsSync(structureDynamicChildrenFolder)) {
        fs.rmSync(structureDynamicChildrenFolder, { recursive: true, force: true });
    }
    if (structureSqlFiles.size > 0) {
        fs.mkdirSync(structureDynamicChildrenFolder);
    }

    if (fs.existsSync(structureHelperStatementsFolder)) {
        fs.rmSync(structureHelperStatementsFolder, { recursive: true, force: true });
    }
    if (helperSqlFiles.size > 0) {
        fs.mkdirSync(structureHelperStatementsFolder);
    }

    // writing files

    if (domains != null) {
        fs.writeFileSync(util.format("%s/domains.json", configDir), stringify(domains), "utf8");
    } else if (fs.existsSync(util.format("%s/domains.json", configDir))) {
        fs.rmSync(util.format("%s/domains.json", configDir));
    }
    if (policyRules != null) {
        fs.writeFileSync(util.format("%s/policyRules.json", configDir), stringify(policyRules), "utf8");
    } else if (fs.existsSync(util.format("%s/policyRules.json", configDir))) {
        fs.rmSync(util.format("%s/policyRules.json", configDir));
    }
    if (usergroups != null) {
        fs.writeFileSync(util.format("%s/usergroups.json", configDir), stringify(usergroups, { maxLength: 160 }), "utf8");
    } else if (fs.existsSync(util.format("%s/usergroups.json", configDir))) {
        fs.rmSync(util.format("%s/usergroups.json", configDir));
    }
    if (usermanagement != null) {
        fs.writeFileSync(util.format("%s/usermanagement.json", configDir), stringify(usermanagement, { maxLength: 120 }), "utf8");
    } else if (fs.existsSync(util.format("%s/usermanagement.json", configDir))) {
        fs.rmSync(util.format("%s/usermanagement.json", configDir));
    }
    if (classes != null) {
        fs.writeFileSync(util.format("%s/classes.json", configDir), stringify(classes, { maxLength: 100 }), "utf8");
    } else if (fs.existsSync(util.format("%s/classes.json", configDir))) {
        fs.rmSync(util.format("%s/classes.json", configDir));
    }
    if (classPerms != null) {
        fs.writeFileSync(util.format("%s/classPerms.json", configDir), stringify(classPerms, { maxLength: 100 }), "utf8");
    } else if (fs.existsSync(util.format("%s/classPerms.json", configDir))) {
        fs.rmSync(util.format("%s/classPerms.json", configDir));
    }
    if (attrPerms != null) {
        fs.writeFileSync(util.format("%s/attrPerms.json", configDir), stringify(attrPerms, { maxLength: 100 }), "utf8");
    } else if (fs.existsSync(util.format("%s/attrPerms.json", configDir))) {
        fs.rmSync(util.format("%s/attrPerms.json", configDir));
    }
    if (structure != null) {
        fs.writeFileSync(util.format("%s/structure.json", configDir), stringify(structure, { maxLength: 80 }), "utf8");
    } else if (fs.existsSync(util.format("%s/structure.json", configDir))) {
        fs.rmSync(util.format("%s/structure.json", configDir));
    }
    if (dynchildhelpers != null) {
        fs.writeFileSync(util.format("%s/dynchildhelpers.json", configDir), stringify(dynchildhelpers, { maxLength: 80 }), "utf8");
    } else if (fs.existsSync(util.format("%s/dynchildhelpers.json", configDir))) {
        fs.rmSync(util.format("%s/dynchildhelpers.json", configDir));
    }

    if (helperSqlFiles != null && helperSqlFiles.size > 0) {
        helperSqlFiles.forEach(async (value, key) => {
            fs.writeFileSync(util.format("%s/%s", structureHelperStatementsFolder, key), value, "utf8");
        });
    }
    if (structureSqlFiles != null && structureSqlFiles.size > 0) {
        structureSqlFiles.forEach(async (value, key) => {
            fs.writeFileSync(util.format("%s/%s", structureDynamicChildrenFolder, key), value, "utf8");
        });
    }
    if (xmlFiles != null && xmlFiles.size > 0) {
        xmlFiles.forEach(async (xmlToSave, fileName) => {
            fs.writeFileSync(util.format("%s/%s", confAttrXmlSnippetsFolder, fileName), xmlToSave, "utf8");
        });
    }
}

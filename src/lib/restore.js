import fs from 'fs';
import util from 'util';
import zlib from 'zlib';
import { getClientInfo, initClient } from './tools/db';
import { logInfo, logOut, logVerbose } from './tools/tools';
import csTruncate from './truncate';

async function csRestore(options) {
    let { file, execute, main } = options;
    if (file == null) throw "file has to be set !";

    let client = await initClient(global.config.connection, execute);

    logOut(util.format("Reading statements from %s", file));
    
    let statements = [];
    statements.push(await csTruncate({ execute: false, init: true, silent: true, }));
    if(file.endsWith(".gz")){
        statements.push(zlib.gunzipSync(fs.readFileSync(file)).toString("utf8"));
    } else {
        statements.push(fs.readFileSync(file, "utf8"));
    }

    if (execute) {
        logOut(util.format("Executing statements on '%s' ...", getClientInfo()));
        let start = new Date();
        await client.query(statements.join("\n"));
        let end = new Date();
        let seconds = (end - start) / 1000;
        logVerbose(util.format(" ↳ done in %f seconds.", seconds));
    } else {
        logOut();
        logOut("###################################### ");
        logOut("##### showing restore statements ##### ");
        logOut("###################################### ");
        logOut();
        logOut(statements.join("\n"), { noSilent: main });
        logOut();
        logInfo("DRY RUN ! Nothing happend yet. Use -X to execute restore.");
    }
}   

export default csRestore;
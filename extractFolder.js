// Adapted from https://stackoverflow.com/a/10391641
// adm-zip docs: https://www.npmjs.com/package/adm-zip

const myArgs = process.argv.slice(2);
if (myArgs.length !== 2) {
    console.log("Usage: node extractFolder.js <source URL> <destination path>");
    process.exit(1);
}

const file_url = myArgs[0];

const AdmZip = require('adm-zip');
const request = require('request');

console.log("Downloading...");
request.get({url: file_url, encoding: null}, (err, res, body) => {
    console.log("Unzipping...");
    const zip = new AdmZip(body);
    const zipEntries = zip.getEntries();
    console.log("Contains", zipEntries.length, "files");

    console.log("Saving...");
    zip.extractAllTo(/*target path*/ myArgs[1], /*overwrite*/ true);
    console.log("Done!");
});
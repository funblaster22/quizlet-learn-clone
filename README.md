# A scuffed Quizlet Learn clone

## Setup
On glitch.com, upload the names.json file to "public," then run:
```
node extractFolder.js <URL> <dest>
npm run build
refresh
```
This is necessary because it downloads the zip into memory, bypassing the storage constraints.
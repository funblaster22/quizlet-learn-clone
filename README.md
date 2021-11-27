# A scuffed Quizlet Learn clone

## Setup
On glitch.com, upload the names.json file to "public," then run:
```
npm run build
node extractFolder.js <URL> <dest>

refresh
```
This is necessary because it downloads into memory, to bypass the storage constraints.
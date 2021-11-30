# A scuffed Quizlet Learn clone

## Demo!
https://funblaster22.github.io/quizlet-learn-clone/ (most up-to-date)

http://imsa-flashcards.glitch.me/

## Overview

How well do you know the names of other students? Learn (or test yourself) with this lovely Quizlet clone I made!
You are shown multiple choice questions for each person until you get it right 2 times in a row, then it advances to free response. You are only ever exposed to 10 students at once. Also, it works offline 🙂

## Setup
On glitch.com, upload the names.json file to "public," then run:
```
node extractFolder.js <URL> <dest>
npm run build
refresh
```
This is necessary because it downloads the zip into memory, bypassing the storage constraints.

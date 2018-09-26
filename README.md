# Pirple Node.js course practice
Here lies all the code I wrote while learning Node.js with the [Pirple's Node.js course](https://pirple.thinkific.com/courses/the-nodejs-master-class).

Every assignment/practice-module is stored in its own git submodule for more-or-less easy code management.

## Why bother with TypeScript?

Being a full-time front-end developer I decided to learn true back-end Node.js with the help of [Pirple Node.js course](https://pirple.thinkific.com/courses/the-nodejs-master-class). And due to my immense familiarity with all specifications of standard JavaScript and its module system, I decided to raise the stakes a bit and give myself a little challenge: complete every single practice section of this course using only TypeScript to also test my cognitive transpilation skills.

This, however, comes with an obvious burden of having some npm dependencies which the course thoroughly lacks. In such a context, npm dependencies *might* feel like a cheat, but the only dependencies here are the ones **needed** for the TypeScript to work with Node.js and .env files. That being said, all the functionality is implemented using the very same modules that are used in the course. No third-party NPM libraries - so **no** cheating here.

## Setup

### Clone
```bash
git clone --recursive https://github.com/Raiondesu/pirple-node-course.git

npm i typescript tslint ts-node ts-node-dev dotenv
rm package-lock.json
```

### Run
Follow the `Run` section in projects' READMEs.

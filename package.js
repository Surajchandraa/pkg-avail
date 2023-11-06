#!/usr/bin/env node

let red="\x1b[31m";
let blue="\x1b[34m";
let reset = "\x1b[0m";
let yellow= "\x1b[33m";


const https = require('https');

const packageName = process.argv.slice(2); 
const verboseMode = process.argv.includes('--verbose');


if (!packageName) {
  console.error('Please provide a package name.');
  process.exit(1);
}


for(let i=0;i<packageName.length;i++){
const url = `https://registry.npmjs.org/${packageName[i]}`;

https.get(url,(res)=>{

    let data='';

    res.on('data',(chunk)=>{
        data+=chunk;
    })

    res.on('end',()=>{
        let jsonData = JSON.parse(data);
        if (jsonData.error && jsonData.error === 'Not found') {
            console.log(blue+`Package name '${packageName[i]}' is available!`+reset);
          } else {
            console.log(yellow+`Package name '${packageName[i]}' is already taken.`+reset);
            if (verboseMode) {
              console.log(red+`Package Details:`+reset);
              console.log('package name:'+` ${packageName[i]}`)
              console.log(`${blue}- Version:${reset} ${jsonData['dist-tags'].latest}`);
              console.log(`${blue}-Description:${reset} ${jsonData.versions[jsonData['dist-tags'].latest].description}`);
              const authorInfo = jsonData.versions[jsonData['dist-tags'].latest].author;

              let author;
              if (authorInfo) {
              author = authorInfo.name || authorInfo;
}             else {
              author = 'Unknown';
              }

              console.log(`${blue}- Author:${reset} ${author}\n\n`);

              
            }
          }
    });

    
}).on('error',(err)=>{
    console.log("Error "+err.message)
})

}
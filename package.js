#!/usr/bin/env node
const ansi=require("./ansi")




const https = require('https');


const packageName = process.argv.slice(2).filter(arg => !arg.startsWith('--'));
const verboseMode = process.argv.includes('--verbose');

if (!packageName.length) {
  console.error('Please provide at least one package name.');
  process.exit(1);
}

for (let i = 0; i < packageName.length; i++) {
  const url = `https://registry.npmjs.org/${packageName[i]}`;

  https.get(url, (res) => {

    let data = '';

    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      let jsonData = JSON.parse(data);
      if (jsonData.error && jsonData.error === 'Not found') {
        console.log(ansi.fgBlue + `[${i}]  Package name '${packageName[i]}' is available! \n` + ansi.reset);
      } else {
        console.log(ansi.fgYellow + `[${i}]  Package name '${packageName[i]}' is already taken.` + ansi.reset);
        if (verboseMode) {
          console.log(ansi.fgRed + `Package Details:` + ansi.reset);
          console.log(ansi.fgBlue+'package name:' +ansi.reset+ ` ${packageName[i]}`)
          console.log(`${ansi.fgBlue}- Version:${ansi.reset} ${jsonData['dist-tags'].latest}`);
          console.log(`${ansi.fgBlue}-Description:${ansi.reset} ${jsonData.versions[jsonData['dist-tags'].latest].description}`);
          const authorInfo = jsonData.versions[jsonData['dist-tags'].latest].author;

          let author;
          if (authorInfo) {
            author = authorInfo.name || authorInfo;
          } else {
            author = 'Unknown';
          }

          console.log(`${ansi.fgBlue}- Author:${ansi.reset} ${author}\n\n`);
        }
      }
    });

  }).on('error', (err) => {
    console.log("Error " + err.message)
  });
}

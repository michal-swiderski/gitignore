#!/usr/bin/env node

const fetch = require('node-fetch');
const fs = require('fs');
const os = require('os');
const argv = require('yargs')
  .option('save', {
    alias: 's',
    type: 'boolean',
    description: 'Saves output into a .gitignore file'
  })
  .option('list', {
    alias: 'l',
    type: 'boolean',
    description: 'Lists possible gitignores'
  })
  .argv


URL = 'https://gitignore.io/api/';

(async function(){
    
    try {
        if(argv.list){
            const res = await fetch(URL + 'list');
            const text = await res.text()
            console.log(text.split(',').join(os.EOL));
        }
        else {
            const name = argv._[0];
            if(!name) {
                console.error('No name specified');
                process.exit(1);
            }

            const res = await fetch(URL + name);
            const text = await res.text()
        
            switch(res.status) {
                case 200:
                    if(argv.save){
                        fs.writeFileSync('./.gitignore', text);
                    }
                    else{
                        console.log(text);
                    }
                    break;
                case 404:
                    console.error(`Stack "${name}" not found`);
                    process.exit(1);
                default:
                    console.error('Something went wrong');
                    process.exit(1);
            }
        }
    }
    catch(e) {
        console.error('Something went wrong');
        process.exit(1);
    }
})();




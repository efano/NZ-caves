"use strict"

// load the fs module
var fs = require('fs');
var chalk = require('chalk');

// read the file into the script with the readFile() method,
// designating utf-8 character encoding
fs.readFile(__dirname + '/../data/cartocolors-added.json', function (err, data) {

  // if there is an error loading the data, throw an error 
  if (err) throw error;
  // otherwise, you have access to data here
  // we can log the buffer to the terminal
  console.log(chalk.green("data loaded!"));
  // or send the parsed data as an argument to another function
  extractScheme(JSON.parse(data));
})

function extractScheme(data) {
  // create a new object with key 'Antique' and value the object
  var outputData = {
    'Bold': data['Bold']
  };
  console.log(chalk.magenta('object extracted: '), outputData);
  writeOutputFile(outputData)
}

function writeOutputFile(outputData) {

  // write the data to a new file using the writeFile() method, stringifying the JS object
  fs.writeFile(__dirname + '/../data/boldcolors.json', JSON.stringify(outputData), 'utf-8', function (err) {
    if (err) throw err;
    console.log(chalk.blue('super cool, file written.'));
  });
}
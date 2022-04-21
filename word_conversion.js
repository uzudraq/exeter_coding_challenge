const fs = require('fs'); //file system module for processing files
const csv = require('csv-parser');
const startTime = performance.now() 
var word_li = fs.readFileSync('find_words.txt').toString().split("\n") 

function countInstances(string, word) {
    return string.split(word).length - 1;
 }
const french_dict = {} 
fs.createReadStream("french_dictionary.csv")
.pipe(csv())
.on('data', function(data){
    try {
        french_dict[data.english] = data.french
    }
    catch(err) {
        console.log(err);
    }
})
.on('end',function(){
    var txt_data = fs.readFileSync('t8.shakespeare.txt').toString()
    let replacedWords = [] 
    let frequencyWords = [] 
    let freq_data; 
    let csv_head = "English word,French word,Frequency"+"\n" 
    fs.writeFileSync("frequency.csv", csv_head) 
    for(let i of word_li){ 
        let count = countInstances(txt_data, i) 
        frequencyWords.push(count) 
        replacedWords.push(i)
        if(txt_data.includes(i)){
            // console.log(typeof(i));
            let re = new RegExp(`${i}`, 'g');
            txt_data = txt_data.replace(re,french_dict[i]) 
            freq_data = i+","+french_dict[i]+","+count+"\n"
            fs.appendFileSync("frequency.csv", freq_data) 
        }
    }
    fs.appendFileSync("t8.shakespeare.translated.txt", txt_data)
    const used = process.memoryUsage().heapUsed / 1024 / 1024;
    var endTime = performance.now()
    let timeString = "Time to process: " + (endTime - startTime) + " milliseconds\n";
    let memoryString = "Memory used: "+ Math.round(used * 100) / 100 + "MB";
    fs.writeFileSync("performance.txt",timeString+memoryString) 
    console.log("completed")
});



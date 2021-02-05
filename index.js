'use strict';
 
//モジュールの読み込み
const fs = require('fs');
const readline = require('readline');
 
const express = require('express');
const app = express();
 
app.use(express.json());
 
app.get('/', (req, res) => {
    var zipcode = req.query.zipcode;
    var zipInfo = {
        "result" : "NotFound"
    };
 
    //readstreamを作成
    const rs = fs.createReadStream('./zipcode.csv');
    var rl = readline.createInterface(rs, {});
 
    rl.on('line', function(line) {
        // 受け取ったlineを逆順にして出力
        if(line.split(",")[2].slice(1,-1) == zipcode){
            zipInfo.result = "Found";
            zipInfo.zipcode = line.split(",")[2].slice(1,-1);
            zipInfo.prefecture = line.split(",")[6].slice(1,-1);
            zipInfo.town = line.split(",")[7].slice(1,-1);
            zipInfo.address = line.split(",")[8].slice(1,-1);
        }
    });
 
    rl.on('close', function(line) {
        if(zipInfo.result == "NotFound"){
            res.status(404).json(zipInfo);
        } else {
            res.json(zipInfo);
        }
    });
 
});
 
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

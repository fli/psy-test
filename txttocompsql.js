import * as fs from "fs";

fs.readFile('./sumtscore.csv', 'utf8', function (err, data) {
    if (err) {
	throw err;
    }
    let arr = data.split('\n');

    function entryBuilder(a, b) {
	return "'[" + a + ", " + b + "]'";
    }

    function stringify(s) {
	return "'" + s + "'";
    }
    
    for (let i = 0; i < arr.length; i++) {
	let row = arr[i];
	if (row == "") continue;
	let [tscoreSum, fsiq2, rank, conf] = row.split(",");
	rank = stringify(rank);
	let [a, b] = conf.split("-");
	conf = entryBuilder(a, b);
	let s = "(DEFAULT, " + tscoreSum + ", " + fsiq2 + ", " + rank + ", " + conf +"),";
	console.log(s);
    }
});

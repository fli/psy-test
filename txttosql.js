import * as fs from "fs";

const startLine = 20;
const postfix = ", '[12, 12]', '[0, 3]'),";

fs.readFile('./120-123', 'utf8', function (err, data) {
    if (err) {
	throw err;
    }
    let arr = data.split('\n');

    function entryBuilder(a, b) {
	return "'[" + a + ", " + b + "]'";
    }

    function processEntry(x) {
	switch (x.indexOf("-")) {
	case 0:
	    return "DEFAULT";
	    break;
	case -1:
	    return entryBuilder(x, x);
	    break;
	default:
	    let [a, b] = x.split("-");
	    return entryBuilder(a, b);
	}
    }
    
    for (let i = 0; i < arr.length; i++) {
	let row = arr[i];
	if (row == "") continue;
	let currentRow = startLine + i;
	let [vc, mr] = row.split("\t");
	vc = processEntry(vc);
	mr = processEntry(mr);
	let s = "(DEFAULT, " + currentRow + ", " + vc + ", " + mr + postfix;
	console.log(s);
    }
});

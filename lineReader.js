const {readFileSync} = require('fs');

exports.getLines = (file) => {
    const data = readFileSync(file).toString();
    const lines = [];

    let idx = 0;
    let lastIdx = 0;

    if(data.indexOf('\r\n') == -1) return [data]; // If there is only one line, return it and we're already done.

    while(idx < data.length) { // Otherwise loop through them all
        idx = data.indexOf('\r\n', lastIdx);

        if(idx == -1) idx = data.length;

        lines.push(data.substring(lastIdx, idx));
        lastIdx = idx+2;
    }

    return lines;
}
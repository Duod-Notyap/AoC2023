const fs = require("fs");

function getNumber(text) {
    var first;
    var last;
    var test = /[0-9]/
    for(var i = 0; i < text.length; i++) {
        var cur = indexTest(text, i);
        if(cur != null) {
            first = cur;
            break;
        }
    }
    for(var i = text.length-1; i >= 0; i--) {
        var cur = indexTestBackwards(text, i);
        if(cur != null) {
            last = cur;
            break;
        }
    }
    return first*10+last
}

const strings = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
    six: 6,
    seven: 7,
    eight: 8,
    nine: 9
}
function indexTest(text, index) {
    var test = /[0-9]/;
    if(test.test(text[index])) {
        return Number(text[index])
    } else {
        for(var key of Object.keys(strings)) {
            //could cache same length keys to avoid duplicate substrings but i do not care.
            if(text.substring(index, index+key.length) === key) {
                return strings[key];
            }
        }
    }

    return null;
}

function indexTestBackwards(text, index) {
    var test = /[0-9]/;
    if(test.test(text[index])) {
        return Number(text[index])
    } else {
        for(var key of Object.keys(strings)) {
            if(text.substring(index - key.length + 1, index + 1) === key) {
                return strings[key];
            }
        }
    }

    return null;
}

function run() {
    var input = fs.readFileSync("./input.b.txt").toString("utf8");
    parts = input.split("\n");
    var total = 0;
    for(var part of parts) {
        if(!part) continue;
        console.log(total)
        total += getNumber(part);
    }
    console.log(total);
}   

run();
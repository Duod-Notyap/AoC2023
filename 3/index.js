const fs = require("fs");

function readInput(filepath) {
    var data = fs.readFileSync(filepath);
    return data.toString("utf-8").split("\n");
}

//{num,x}
function getNextNumber(dataStr, beginIndex) {
    var numStr = ""; 
    var numstart = -1;
    for(var i = beginIndex; i < dataStr.length; i++) {
        if(/[0-9]/.test(dataStr[i])) {
            if(numstart === -1) {
                numstart = i;
                numStr += dataStr[i]
            } else {
                numStr += dataStr[i]
            }
        } else if (numstart !== -1) {
            return {
                num: Number(numStr),
                x: numstart
            }
        }
    }
    if(numstart === -1) {
        return null
    } else {
        return {
            num: Number(numStr),
            x: numstart
        }
    }
}



//Both of these work, site rejected my answer when i used the first iteration. I probably typoed it in the box lol. Lost like 10 mins debugging a non-issue
const symbolTest = /[^0-9\.]/

//Iteration 2
function newIsPartNumber(number, x, y, data) {
    var chars = ""
    if(y > 0) chars += data[y-1].substring(x-1, x + number.toString().length + 1);
    chars += data[y].substring(x-1, x + number.toString().length + 1);
    if(y < data.length - 1) chars += data[y+1].substring(x-1, x + number.toString().length + 1);
    return symbolTest.test(chars);
}

//Iteration 1
function isPartNumber(number, x, y, data) {
    var len = number.toString().length;
    //Test before number
    if(x > 0) {
        x--;
        //Top left
        if(y > 0 && symbolTest.test(data[y-1][x])) return true;
        //Mid left
        if(symbolTest.test(data[y][x])) return true;
        //Bottom left
        if(y < data.length - 1 && symbolTest.test(data[y+1][x])) return true;
        x++;
    }
    //Above and below number
    for(var i = 0; i < len; i++) {
        //Top
        if(y > 0 && symbolTest.test(data[y-1][x])) return true;
        //Bottom
        if(y < data.length - 1 && symbolTest.test(data[y+1][x])) return true;
        x++
    }
    //Top right
    if(y > 0 && x < data[y - 1].length - 1 && symbolTest.test(data[y-1][x])) return true;
    //Mid right
    if(x < data[y].length - 1 && symbolTest.test(data[y][x])) return true;
    //Bottom Right
    if(y < data.length - 1 && x < data[y + 1].length - 1 && symbolTest.test(data[y+1][x])) return true;

    return false;
}




//Part 1
function sumPartNums(data) {
    var results = []
    for(var y = 0; y < data.length; y++) {
        var row = data[y];
        var i = 0;
        do {
            var ret = getNextNumber(row, i)
            if(ret != null) {
                i = ret.x + ret.num.toString().length
                ret.y = y;
                results.push(ret)
            }
        } while(ret != null)
    }
    var sum = 0;
    for(var result of results) {
        if(newIsPartNumber(result.num, result.x, result.y, data)) sum += result.num;
    }
    return sum
}


var num = /[0-9]/;
/**
 * reads backwards from index to the start of the string then parses out the number
 * @param {*} str 
 * @param {*} x 
 * @returns 
 */
function goBackAndGetNumber(str, x) {
    while(num.test(str[x])) x--;
    return getNextNumber(str, x);
}

function findAndCaluclateGear(x, y, data) {
    var nums = []
    var addNum = (number, seen) => {
        if(!seen.has(number.x)) {
            seen.add(number.x)
            nums.push(number.num)
        }
    }

    /**
     * Goes Row by row and checks the 3 pertinent characters to that location in that row 
     * we avoid duplicates by having a Set keep a list of indexes that have valid numbers 
     * If we see an index we add it to the set and if we see the index again we skip it
     * (the purpose of addNum()). We do that for all 3 , nearby rows * and if we only have
     * 2 valid numbers at the end we have a valid gear
     */

    //Row 1
    if(y > 0) {
        let seen = new Set();
        if(x > 0 && num.test(data[y-1][x-1])) addNum(goBackAndGetNumber(data[y-1], x-1), seen);
        if(num.test(data[y-1][x])) addNum(goBackAndGetNumber(data[y-1], x), seen);
        if(x < data[y-1].length && num.test(data[y-1][x+1])) addNum(goBackAndGetNumber(data[y-1], x+1), seen);
    }
    
    {   //I dont want seen out of this scope
        let seen = new Set();
        if(x > 0 && num.test(data[y][x-1])) addNum(goBackAndGetNumber(data[y], x-1), seen);
        if(x < data[y].length - 1 && num.test(data[y][x+1])) addNum(goBackAndGetNumber(data[y], x+1), seen);
    }

    if(y < data.length - 1) {
        let seen = new Set();
        if(x > 0 && num.test(data[y+1][x-1])) addNum(goBackAndGetNumber(data[y+1], x-1), seen);
        if(num.test(data[y+1][x])) addNum(goBackAndGetNumber(data[y+1], x), seen);
        if(x < data[y+1].length && num.test(data[y+1][x+1])) addNum(goBackAndGetNumber(data[y+1], x+1), seen);
    }
    if(nums.length == 2) {
        return nums[0] * nums[1];
    }

    return null;
}

//Part 2
function sumGearRatios(data) {
    var sum = 0;
    for(var y = 0; y < data.length; y++) {
        var row = data[y];
        for(var x = 0; x < row.length; x++) {
            if(row[x] === "*") {
                var res = findAndCaluclateGear(x, y, data);
                if(res !== null) {
                    sum += res
                }
            }
        }
    }
    return sum
}


function run() {
    var data = readInput("./input.txt")

    var sum = sumPartNums(data);
    var gearSum = sumGearRatios(data);

    console.log(`The sum of all part numbers is ${sum}\nThe sum of all gear ratios is ${gearSum}`);
}
run();
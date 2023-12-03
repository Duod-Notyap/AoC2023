const fs = require("fs");

// [ [ {r,g,b}, ...], ...]
function parse(filename) {
    let fileData = fs.readFileSync(filename).toString("utf8");
    let lines = fileData.split("\n");
    let games = []
    for(var line of lines) {
        if(!line) continue; 
        let rounds = line.split(":")[1];
        let rs = []
        for(var round of rounds.split(";")) {
            let r = {}; 
            for(var count of round.split(",").map(a => a.trim())) {
                let parts = count.split(" ")
                r[parts[1].trim()] = Number(parts[0].trim())
            }
            rs.push(r)
        }
        games.push(rs)
    }

    return games
}

function maxGame(rounds) {
    var r = {red: 0, green: 0, blue: 0}
    for(var round of rounds) {
        if(round.red > r.red) r.red = round.red;
        if(round.green > r.green) r.green = round.green; 
        if(round.blue > r.blue) r.blue = round.blue;
    }
    return r;
}

//part 1
function countWith(games, countR, countG, countB) {
    var maxxed = games.map(maxGame)
    var total = 0;
    for(var i = 0; i < maxxed.length; i++) {
        var max = maxxed[i]
        if(max.red <= countR && max.green <= countG && max.blue <= countB) {
            total += i + 1;
        }
    }
    return total
}

//part 2
function sumPowerMin(games) {
    var total = 0;
    for(var game of games.map(maxGame)) {
        total += game.red * game.green * game.blue;
    }
    return total;
}

function run() {
    var games = parse("./input.txt")

    //part 1
    var total = countWith(games, 12, 13, 14);

    //part 2
    var sumPower = sumPowerMin(games);

    console.log(`The sum of game IDs possible with 12R, 13G, 14B is ${total}`);
    console.log(`The sum of the power of the sets of minimum possible cube counts is ${sumPower}`);
}

run()
use std::fs;

fn main() {
    let contents = fs::read_to_string("./input.txt");
    if let Ok(str_content) = contents {
        run_challenge(&str_content);
    } else {
        println!("Failed to read file contents");
    }
}

fn run_challenge(str_data: &String) {
    let game_data = parsing::parse_data(str_data);
    let total_points = challenge_logic::sum_game_points(&game_data);
    println!("The total points won for these games are {}", total_points);

    let total_cards = challenge_logic::count_cards(&game_data);
    println!("The total number of won cards is {}", total_cards);
}

mod parsing {
    use crate::challenge_logic::Game;
    
    pub fn parse_data(str: &String) -> Vec<Game> {
        return str.split('\n').map(parse_line).collect();
    }
    
    fn parse_line(str: &str) -> Game {
        let mut separator = str.split(':');
        separator.next();
        let mut parts = separator.next()
            .unwrap()
            .split('|');
        let winning_str = parts.next().unwrap();
        let recieved_str = parts.next().unwrap();
        return Game {
            winning: deconstruct_num_str(winning_str),
            numbers: deconstruct_num_str(recieved_str)
        };
    }
    
    fn deconstruct_num_str(str: &str) -> Vec<i32> {
        return str.split(' ')
            .map(|str| str.trim())
            .filter(|str| !str.is_empty())
            .map(|str| str.parse().unwrap())
            .collect();
    }
    
}

mod challenge_logic {
    use std::fmt::Debug;

    
    pub struct Game {
        pub winning: Vec<i32>,
        pub numbers: Vec<i32>
    }

    impl Debug for Game {
        fn fmt(&self, f: &mut std::fmt::Formatter<'_>) -> std::fmt::Result {
            write!(f, "{:?}, {:?}", self.winning, self.numbers)?;
            return std::fmt::Result::Ok(());
        }
    }

    #[allow(dead_code)]  //I wanted to play with lifetimes even though game is unused
    pub struct GameResult<'a> {
        game: &'a Game,
        cards_won: i64
    }

    //Part 1
    pub fn sum_game_points(games: &Vec<Game>) -> i32 {
        return games
            .iter()
            .map(calculate_game_points)
            .sum();
    }
    
    pub fn calculate_game_points(game: &Game) -> i32 {
        let winning_count = count_winning_numbers(game);
        if winning_count > 0 {
            return 2i32.pow(winning_count - 1);
        } else {
            return 0;
        };
    }

    //Part 2
    pub fn count_cards(games: &Vec<Game>) -> i64 {
        let mut sum: i64 = 0;
        let mut resolved: Vec<GameResult> = Vec::new();
        for i in (0..games.len()).rev() {   
            /* We iterate reversed since the last card will always yield zero
             * we can sum the results in reverse then sum the whole list which 
             * is much faster than reading normally */
            let result = resolve_card(&games[i], &resolved);
            sum += result.cards_won;
            resolved.push(result);
        }
        return sum + games.len() as i64;
    }

    fn resolve_card<'a>(game: &'a Game, games: &Vec<GameResult>) -> GameResult<'a> {
        let win_count = count_winning_numbers(game);
        let count: i32 = games.len().try_into().unwrap();
        let begin = count - win_count as i32;
        let sum = games[begin as usize..count as usize]
            .iter()
            .map(|g| g.cards_won + 1)
            .sum();
        return GameResult { 
            game: game, 
            cards_won: sum
        }
    }

    fn count_winning_numbers(game: &Game) -> u32 {
        return game.numbers
            .iter()
            .filter(|number| game.winning.contains(number))
            .count().try_into().unwrap();
    }

}
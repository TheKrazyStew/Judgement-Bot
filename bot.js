/*
 * JUDGEMENT
 * 
 * Author: Kevin "Krazy-Stew" Stewart
 * 
 */

//Imports

const Discord = require("discord.js");
const TwitchAPI = require("node-twitch").default;
const Twit = require('twitter-v2');
const api = require("twitter-api-sdk");
const needle = require('needle');
const {keys} = require("./discord-keys.js");


const bot = new Discord.Client();

//Twitch API Integration
const twitch = new TwitchAPI({
    client_id: keys.twitchID,
    client_secret: keys.twitchSecret,
});

//Twitter API Integration
const T = new Twit({

    /*consumer_key: keys.twitterAPIKey,
    consumer_secret: keys.twitterAPISecret,
    access_token_key: keys.twitterAccessToken,
    access_token_secret: keys.twitterAccessSecret,*/
    bearer_token: keys.twitterBearerToken,

});
const cli = new api.Client(keys.twitterBearerToken);

/*** Variables ***/

/* Responses for the 8-Ball Command
    Positive Responses - 7
    Negative Responses - 7
    Non-committal Responses - 6, not counting DIO
    Total - 20 responses, not counting DIO
*/
var answerBank = [
    "Yes.",
    "No.",
    "Definitely.",
    "Definitely Not.",
    "Why would you ask me that, you sicko?!",
    "Maybe...",
    "I am unsure.",
    "Most likely.",
    "Not very likely...",
    "This does not compute.",
    "All signs point to yes.",
    "Don't count on it.",
    "Your outlook seems good.",
    "Your outlook seems... not so good.",
    "I seriously doubt it.",
    "My uncle who works at Nintendo says no.",
    "My uncle who works at Nintendo says yes.",
    "It is practically written in stone!",
    "Actually, I better not say yet.",
    "All of our lines are busy at the moment. Please hold for the next available line. https://www.youtube.com/watch?v=VBlFHuCzPgY"
];

var basedBank = [
    "Cheems? Doge?",
    "A true story?",
    "Facts and logic?",
    "On eyewitness accounts?",
    "On indisputable evidence?"
];

/* Booleans used by the Twitch function
    [tksIsLive, namIsLive, [unused], ehckIsLive]
*/
var isLive = 
    [false,false,false,false];

/*Channel IDs
    namTwitchChannel - Nam's discord channel ID
        to announce streams in
    namWarioChannel - Nam's discord channel ID
        to repost Wario64 tweets in
    testChannel - should be unused
*/
var namTwitchID = keys.namTwitchChannel;
var namWarioID = keys.namTwitterChannel;
var testID = keys.botTestChannel;

/*** Functions ***/

/*Discord
    Automatic procedure for Judgement
    to respond to messages within
    discord servers he is in
*/
bot.on('message', (message) => {
    //Recording username for easier logging
    var username = "" +
        message.member.user.tag +
        " (" +
        message.member.nickname +
        ", " + message.member.user.username +
        ")";

    //This is the name that will be used in responses if the need arises
    var trigName = (message.member.nickname != null) 
        ? message.member.nickname 
        : message.member.user.username;
    //Don't respond to a message if it's from a bot - either another bot or itself
    if (message.author.bot) return; 

    //Making the message interpretable by the bot, word by word
    var lcase = message.content.toLowerCase(); 
    var list = lcase.split(" ");

    //Easter Eggs
    try {
    for (var i = 0; i < list.length; i++) {
        if (list[i].includes("judgement")) {
            if (lcase.includes("thanks" || lcase.includes("thank"))) {
                message.channel.send("You're welcome.");
            } else if(lcase.includes("based")){
                message.channel.send("Based on what? " + randFromList(basedBank));
            } else {
                message.channel.send("You rang?");
            }
        } if (list[i].includes("nam") ||
            list[i].includes("namtaskic")) {
            if (!lcase.includes(":")) { //excludes emotes with either word in their names
                message.channel.send("Ah yes, Nam... my favorite server overlord.");
            }

        } if (list[i].includes("turtle")) {
            message.channel.send("hoi tortal");

        } if (list[i].includes("salmon")) {
            message.channel.send("more like... salmon in a bucket");

        } if (list[i].includes("power")) {
            message.channel.send("UNLIMITED POWER!!");

        } if (list[i].includes("vergil")) {
            var vergilBank = [
                "nam ples play dee em see too",
                "I need more power...",
                "Might controls everything.",
                "Why isn't this working? Is there something missing? Must more blood be shed?", 
                "Insane buffoon! I don't know where you came from but you don't belong here. Now leave!",
                "I've come to retrieve my power. You can't handle it.", 
                "Where's your motivation?",
                "You are not worthy as my opponent!",
                "Your nightmare begins here.",
                "Let's have some fun.",
                "My power shall be absolute!",
                "I won't lose to the likes of you... " + trigName + ".",
                "Foolishness....is rushing in blind all you can do?",
                "Admit it, " + trigName + ". I'm just better than you.",
                "Unfortunately, our souls are at odds, " + trigName + ". I need more power!"
            ];

            message.channel.send(randFromList(vergilBank));

        } if (list[i].includes("knack")) {
            message.channel.send("Still waiting for Knack 3, Sony... make it happen.");

        } if (list[i].includes("kingdom") &&
            list[i+1].includes("hearts")) {
            var heartsBank = [
                trigName + "! It's Sephiroth!",
                "That was undeniable proof that we totally owned you lamers.",
                "They'll pay for this.",
                "Ohh, NOW I've got it! *&&X% means \"heart.\"",
                trigName + "... who else will I have ice cream with?",
                "Mickey! It's " + trigName + ". They put bugs in them!",
                "I'm looking for somebody. Have any of you seen a guy with spiky hair?",
                "GET UP ON THE HYDRA'S BACK!",
                "Ah ha ha ha ha ha ha ha ha... Ha ha ha ha ha... I'm a fool.",
                "Aww... I don't understand what's going on..."
            ];

            message.channel.send(randFromList(heartsBank));

        } if (list[i].includes("door") &&
            list[i+1].includes("to") &&
            list[i+2].includes("darkness") ) {

            message.channel.send("Say, fellas, did somebody mention the Door to Darkness?");

        } if (list[i].includes("zero") ) {

            var zeroBank = [
                "If the Sky Lagoon falls it will be disastrous! There's no time... I'm going down!",
                trigName + ", I have a question for you. ... Did your unit attack this place?",
                "This is a matter of personal pride now. There's no avoiding this... I must go.",
                "Nooo!! This isn't happening!! There's no reason for me to go on! What... What am I fighting for?!"
            ];

            message.channel.send(randFromList(zeroBank));

        } if (list[i].includes("mf") &&
            list[i+1].includes("doom")) {

            message.channel.send("MF DOOM");

        }
    }
    } catch (e) {
        console.log("Error finding easter eggs for message: " + message.content);
    }

//Commands
    switch (message.content.substring(0, 1)) { 
        case '~': 
            switch(message.content.split(" ")[0]) {
                case '~roll':
                    //Dice rolling
                    //~roll [dice count] [sides]
                    //~roll [dice count]d[sides]
                    var diceLog = message.content.split(" ")
                    .join("d")
                    .split("d");
                    console.log(diceLog);
                    var i;
                    var rolls = new Array();
                    var diceTotal = 0;

                    if(!(
                        diceLog[1] != null &&
                        diceLog[2] != null &&
                        Number(diceLog[1]) &&
                        Number(diceLog[2])
                    )) {
                        message.channel.send("You need to use numbers for this command to work.")
                    }

                    if(diceLog[1] > 50) {
                        message.channel.send("I don't have that many dice.");
                        break;
                    }
                    for(i = 0; i < diceLog[1]; i++){
                        var die = roll(diceLog[2]);
                        rolls.push(die);
                        diceTotal += die;
                    }
                    message.channel.send("You rolled " + diceTotal + " in total. Your dice came up as " + rolls + ".");

                    break;
                default:
                    //8-ball
                    //Ignore message if the second character in the message is also '~'
                    //Two ~s in a row is used for strikethrough text by Discord
                    if (message.content.substring(1, 2) != '~') { 
                        console.log('8-ball triggered by ' + username);

                        //5% chance Judgement will become DIO instead of answering the question
                        var dioRNG = Math.floor(Math.random() * 100);
                        console.log('DIO RNG: ' + dioRNG);
                        if (dioRNG < 5) { 
                            console.log("DIO Activated!");
                            message.channel.send('You thought you would get an answer, but it was me, DIO!');

                        //Otherwise, make a response
                        } else { 
                            var ans = randFromList(answerBank);
                            console.log("ANS: " + ans);
                            message.channel.send(/*'Hail 2 U! Your answer is: ' + */ans);
                        }
                    }
                    break;
            }
            break;
        default:
            break;
    }
});

/*Discord
    Rolling dice
*/
function roll(sides) {
    return Math.ceil(Math.random() * sides);
}
/*Discord
    Returns a randomly selected element
    from the inputted list
*/
function randFromList(list) {
    return list[Math.floor(Math.random() * list.length)];
}

/*Twitch
    Search for channels going live and announce them
*/
async function streamGetter(name) {
    var nick;
    var i;
    switch(name.toLowerCase()) {
        case "thekrazystew":
            nick = "TKS";
            i = 0;
            break;
        case "namtaskic":
            nick = "Nam";
            i = 1;
            break;
        case "pricecrazy62": //UNUSED; may replace later
            nick = "Price";
            i = 2;
            break;
        case "ehckgaming":
            nick = "Trevor";
            i = 3;
            break;
        default:
            console.log(name + " not a valid streamer");
            return;
    }

    try {
        await twitch.getStreams({ channel: name }).then(async data => {
            const r = data.data[0];

            if(r !== undefined) {
                if(r.type === "live") {
                    if(!isLive[i] || isLive[i] === undefined) {
                        isLive[i] = true;
                        annChannel.send("Hey, @everyone! " + nick + " is streaming now! Check it out at https://twitch.tv/" + name);
                        console.log('new stream detected from ' + nick);
                    }
                }
            } else {
                if(isLive[i]) {
                    isLive[i] = false;
                    console.log(nick + ' is no longer live');
                }
            }
        });
    } catch(e) {
        console.log("Error obtaining stream data for " + name + ". Will try again later");
    }
}

/*Twitch
    The timed function to search for selected streamers
*/
const twitchRun = async function twitchRun() {
    streamGetter("TheKrazyStew");
    streamGetter("Namtaskic");
    //streamGetter("");
    //streamGetter("ehckgaming");
}

/*Twitter
    Send a given tweet to the given channel
*/
async function sendTweet(tweet, chan) {
    try{
        var url = "https://twitter.com/i/status/" + tweet.id;
        var keys = ['Nintendo', 'NSW', 'Xbox', 'XBL', 'Steam',
        'Epic Games Store', 'EGS', 'Playstation', 'PSN',
        'Amazon', 'Gamestop', 'PS5', 'PS4', 'GOG',
        'for a chance to win', 'Switch', 'eShop',
        'XSX', 'XBO', 'amiibo', 'Humble'];
        var i;
        for(i = 0; i < keys.length; i++) {
            if(tweet.text.toLowerCase().includes(keys[i].toLowerCase())) {
                chan.send(url);
                return 0;
            }
        }
    } catch (e) {
        console.log("Error posting about tweet");
        console.error(e);
    }
}

/*Twitter
    Reconnect to the Twitter stream
    if it accidentally disconnects
*/
async function twitConnect(streamFactory, dataConsumer) {
    try {
        for await(const {data} of streamFactory()) {
            dataConsumer(data);
        }
        //Disconnected by Twitter
        console.log("Disconnected by Twitter. Retrying...");
        twitConnect(streamFactory, dataConsumer);
    } catch (e) {
        //Disconnected by error
        console.log("An error occurred fetching tweets. Retrying...");
        twitConnect(streamFactory, dataConsumer);
    }
}

/*Twitter
    Setting up tweet stream; will find and post any tweets fitting established rules
*   WARIO64 RULES:
        - from Wario64
        - tweet includes at least one of many key words/phrases defined below
*/
async function runTweets() {
    const endpoints = {
        'tweet.fields': ['author_id', 'conversation_id'],
        'expansions': ['author_id', 'referenced_tweets.id'],
        'media.fields': ['url'],
    }

    //Get current rules
    const rulesURL = 'https://api.twitter.com/2/tweets/search/stream/rules';
    var response = await needle('get', rulesURL, {
        headers: {
            'authorization': `Bearer ${keys.twitterBearerToken}`
        }
    });
    console.log(response.body);
    rules1 = response.body;
    //Delete current rules
    const ids = rules1.data.map(rule => rule.id);
    const data = {
        "delete": {
            "ids": ids
        }
    }
    response = await needle('post', rulesURL, data, {
        headers: {
            'content-type': 'application/json',
            'authorization': `Bearer ${keys.twitterBearerToken}`
        }
    });

    try {
        const rules = {
            'add': [
                //{'value': "from:TheKrazyStew", "tag":"from tks"},
                {'value': "from:Wario64", "tag":"from wario"}
            ]
        }
        const r = await T.post("tweets/search/stream/rules", rules);
        console.log(r);
    } catch (e) {
        console.log(e);
    }

    twitConnect(
        () => T.stream('tweets/search/stream', endpoints),
        (data) => sendTweet (data, warioChannel),
    );
}

/*** Startup ***/

//Log in the bot
bot.login(keys.discordToken); 

//Bot is ready
bot.on('ready', () => {
    annChannel = bot.channels.cache.get(namTwitchID);
    testChannel = bot.channels.cache.get(testID);
    warioChannel = bot.channels.cache.get(namWarioID);
    console.log('JUDGEMENT v1.10.2');
    setInterval(twitchRun,120000); //Twitch run timer: 2 minutes
    runTweets();
});
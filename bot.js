/*
 * JUDGEMENT
 * 
 * Author: Kevin "Krazy-Stew" Stewart
 */

//Variable initialization

const Discord = require("discord.js");
const TwitchAPI = require("node-twitch").default;
const {keys} = require("./discord-keys.js");


const bot = new Discord.Client();

//Twitch API Integration
const twitch = new TwitchAPI({
    client_id: keys.twitchID,
    client_secret: keys.twitchSecret,
});

//Responses for the 8-Ball Command
/*
    Positive Responses - 7
    Negative Responses - 7
    Non-committal Responses - 6 + DIO
    Total - 20 responses + DIO
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

var username;

//Booleans used by the Twitch function
/*
    [tksIsLive, namIsLive, priceIsLive, default (formerly Varricz)]
*/
var isLive = 
    [false,false,false,false];

//Nam's discord channel ID to announce streams in
var namChannel = keys.twitchDisChannel;
var testChannel = keys.botTestChannel;

bot.on('message', (message) => {
    //Recording username for easier logging
    username = "" +
    message.member.user.tag +
    " (" +
    message.member.nickname +
    ")";

    //Don't respond to a message if it's from a bot - either another bot or itself
    if (message.author.bot) return; 

    //Making the message interpretable by the bot
    var lcase = message.content.toLowerCase(); 
    var list = lcase.split(" ");

    //Easter Eggs
    for (var i = 0; i < list.length; i++) {
        if (list[i].localeCompare("judgement") == 0) {
            if (lcase.includes("thanks" || lcase.includes("thank"))) {
                message.channel.send("You're welcome.");
            } else if(lcase.includes("based")){
                message.channel.send("Based on what? Cheems? Doge?");
            } else {
                message.channel.send("You rang?");
            }
        } if (list[i].localeCompare("nam") == 0 || list[i].localeCompare("namtaskic") == 0) {
            if (!lcase.includes(":")) { //excludes emotes with either word in their names
                message.channel.send("Ah yes, Nam... my favorite server overlord.");
            }
        } if (list[i].localeCompare("turtle") == 0) {
            message.channel.send("hoi tortal");

        } if (list[i].localeCompare("salmon") == 0) {
            message.channel.send("more like... salmon in a bucket");

        } if (list[i].localeCompare("power") == 0) {
            message.channel.send("UNLIMITED POWER!!");

        } if (list[i].localeCompare("vergil") == 0) {
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
                "I won't lose to the likes of you... " + message.member.nickname + ".",
                "Foolishness....is rushing in blind all you can do?",
                "Admit it, " + message.member.nickname + ". I'm just better than you.",
                "Unfortunately, our souls are at odds, " + message.member.nickname + ". I need more power!"
            ];

            var ans = vergilBank[Math.floor(Math.random() * vergilBank.length)];
            message.channel.send(ans);

        } if (list[i].localeCompare("knack") == 0) {
            message.channel.send("Still waiting for Knack 3, Sony... make it happen.");

        } if (list[i].localeCompare("kingdom") == 0 && list[i+1].localeCompare("hearts") == 0) {
            var heartsBank = [
                message.member.nickname + "! It's Sephiroth!",
                "That was undeniable proof that we totally owned you lamers.",
                "They'll pay for this.",
                "Ohh, NOW I've got it! *&&X% means \"heart.\"",
                message.member.nickname + "... who else will I have ice cream with?",
                "Mickey! It's " + message.member.nickname + ". They put bugs in them!",
                "I'm looking for somebody. Have any of you seen a guy with spiky hair?",
                "GET UP ON THE HYDRA'S BACK!",
                "Ah ha ha ha ha ha ha ha ha... Ha ha ha ha ha... I'm a fool.",
                "Aww... I don't understand what's going on..."
            ];

        var ans = heartsBank[Math.floor(Math.random() * heartsBank.length)];
        message.channel.send(ans);

        } if (list[i].localeCompare("door") == 0 &&
            list[i+1].localeCompare("to") == 0 &&
            list[i+2].localeCompare("darkness") == 0) {

            message.channel.send("Say, fellas, did somebody mention the Door to Darkness?");

        } if (list[i].localeCompare("zero") == 0) {

            var zeroBank = [
                "If the Sky Lagoon falls it will be disastrous! There's no time... I'm going down!",
                message.member.nickname + ", I have a question for you. ... Did your unit attack this place?",
                "This is a matter of personal pride now. There's no avoiding this... I must go.",
                "Nooo!! This isn't happening!! There's no reason for me to go on! What... What am I fighting for?!"
            ];

            var ans = zeroBank[Math.floor(Math.random() * zeroBank.length)];
            message.channel.send(ans);
        } if (list[i].localeCompare("mf") == 0 &&
            list[i+1].localeCompare("doom") == 0) {

            message.channel.send("MF DOOM");

        }

    }
//8-Ball Command
    switch (message.content.substring(0, 1)) { 
        case '~': 
            //Ignore message if the second character in the message is also '~'
            //Two ~s in a row is used for strikethrough text by Discord
            if (message.content.substring(1, 2) != '~') { 
                console.log('8-ball triggered by ' + username);

                //5% chance Judgement will become DIO instead of answering the question
                var dioRNG = Math.floor(Math.random() * 100);
                console.log('DIO RNG: ' + dioRNG);
                if (dioRNG < 5) { 
                    console.log("DIO Activated!")
                    message.channel.send('You thought you would get an answer, but it was me, DIO!');

                //Otherwise, make a response
                } else { 
                    var ans = answerBank[Math.floor(Math.random() * answerBank.length)];
                    console.log("ANS: " + ans);
                    message.channel.send(/*'Hail 2 U! Your answer is: ' + */ans);
                }
                break;
            }
            break;
        default:
            break;
    }
});

//Twitch - Search for channels going live and announce them

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
        case "pricecrazy62":
            nick = "Price";
            i = 2;
            break;
        default:
            nick = name;
            i = 3;
    }

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
}

const run = async function Run() {
    streamGetter("TheKrazyStew");
    streamGetter("Namtaskic");
    streamGetter("Pricecrazy62");
}

//Log in the bot
bot.login(keys.discordToken); 

//Bot is ready
bot.on('ready', () => {
    annChannel = bot.channels.cache.get(namChannel);
    console.log('JUDGEMENT v1.9.4');
    setInterval(run,5000);
});
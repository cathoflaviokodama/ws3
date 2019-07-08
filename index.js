const Server = require("./server.js");
const Client = require("./client.js");
const pegjs = require("pegjs");
const readline = require('readline');
const fs = require("fs");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

setTimeout(async function() {
    var server = Server();
    await server.httpPromise;
    var lang = pegjs.generate( fs.readFileSync("lang.pegjs","utf8") );
    function prompt() {
        rl.question('>', async (answer) => {
            console.log(answer);
            if(answer == "send") {
                var client = Client();
                await client.dataPromise;
                prompt();
            } else if(answer == "quit") {
                console.log("quit");
                server.http.close();
                rl.close();
            } else {
                try {
                    var result = lang.parse(answer);
                    if(result) {
                        var client = Client({a:10,b:20});
                        await client.dataPromise;
                    }
                    console.log(result);
                } catch(e) {
                    console.log("ERROR");
                    console.log(e.messsage);
                }
                prompt();
            }
        });
    }
    prompt();
},0);


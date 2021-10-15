const express = require('express');
const app = express();
const url = require('url');
const axios = require('axios');
const base = process.env.BASE_URL;

app.get(`/${base}/`, (req, res) => {
    return res.json({code: 200, message: "operational"});
});     

app.get(`/${base}/ServerList`, (req, res) => { // Returns the list of servers for a given appID from the SteamAPI
    const query = url.parse(req.url, true).query;
    if (query !== null && query.appID !== undefined && query.appID !== "") {
        axios.get(`https://api.steampowered.com/IGameServersService/GetServerList/v1/?filter=\\appid\\${query.appID}&key=${process.env.API_KEY}`)
            .then(function (response) {
                if (response.status === 200) {
                    /* Server Map/Filtering
                    let data = response.data.response.servers.map((server) => {   
                        let ipAddr = server.addr.split(":")[0];
                        return { ServerName: server.name, Map: server.map, CurrentPlayers: server.players, MaxPlayers: server.max_players, IP: ipAddr, Port: server.gameport, SteamID: server.steamid, VAC: server.secure }
                    });*/
                    if (response.data.response.servers.length > 0) return res.json({ code: 200, data: response.data.response.servers });
                    else return res.json({ code: 404, message: "Servers not found" });
                }
                else {
                    return res.json({ code: 500, message: "Internal server error" });
                }
            })
            .catch(function (error) {
                return res.json({code: 404, message: `AppID: "${query.appID}" not found`});
            });
    }
    else {
        return res.json({code: 400, message: "Bad Request"});
    }
});

app.get(`/${base}/ReturnIP`, (req, res) => { // Returns the IP of the user for use within the app to see which server is the user's in the browser
    return res.json({ code: 200, data: req.headers['x-forwarded-for'] || req.socket.remoteAddress });
});

app.listen(3000);
  

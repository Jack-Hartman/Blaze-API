const express = require('express');
const app = express();
const url = require('url');
const axios = require('axios');
const base = process.env.BASE_URL;

app.get(`/${base}/`, (req, res) => {
    return res.json({code: 200, message: "operational"});
});

app.get(`/${base}/ServerList`, (req, res) => {
    const query = url.parse(req.url, true).query;
    if (query !== null && query.appID !== undefined && query.appID !== "") {
        axios.get(`https://api.steampowered.com/IGameServersService/GetServerList/v1/?filter=\\appid\\${query.appID}&key=${process.env.API_KEY}`)
            .then(function (response) {
                if (response.status === 200) {
                    let data = response.data.response.servers.map((server) => {
                        return { ServerName: server.name, Map: server.map, CurrentPlayers: server.players, MaxPlayers: server.max_players, IPandPort: server.addr }
                    })
                    return res.json({ code: 200, data: data });
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

app.listen(3000);
  
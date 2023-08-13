const express = require("express");
const app = express();
const ytdl = require("ytdl-core");
const ytpl = require("ytpl");

app.set("view engine", "ejs");

app.get("/", (req, res) => {
    return res.render("index");
});

app.get("/download", async (req, res) => {
    const url = req.query.url;
    
    // Check if the URL is a playlist
    if (url.includes("list=")) {
        try {
            const playlist = await ytpl(url);
            
            const playlistInfo = playlist.items.map(item => {
                const v_id = item.id;
                return {
                    url: "https://www.youtube.com/embed/" + v_id,
                    title: item.title
                };
            });

            return res.render("playlist", {
                playlist: playlistInfo
            });
        } catch (error) {
            console.error("Error fetching playlist:", error);
            return res.render("error", { message: "Error fetching playlist" });
        }
    } else {
        try {
            const v_id = url.split('v=')[1];
            const info = await ytdl.getInfo(url);

            return res.render("download", {
                url: "https://www.youtube.com/embed/" + v_id,
                info: info.formats.sort((a, b) => a.mimeType < b.mimeType),
            });
        } catch (error) {
            console.error("Error fetching video:", error);
            return res.render("error", { message: "Error fetching video" });
        }
    }
});

app.listen(3000, () => {
    console.log("Server is running on http://localhost:3000");
});
const ExpressAPI = require("express");
const App = ExpressAPI();

App.set("view engine", "pug");
App.use(ExpressAPI.static(__dirname + '/public'));

App.get('/articles', (req, res) => {
    res.render("articles");
});

App.get('/chat', (req, res) => {
    res.render("chat-app");
});

App.get('/chat-app', (req, res) => {
    res.render("chat-app");
});

const Server = App.listen(7000, () => {
    console.log(`Express running → PORT ${Server.address().port}`);
});

const io = require("socket.io")(8000, {
    cors: {
        origin: "*",
    }
});

const Articles = require("./Databases/Articles.json");
var Chat_Server_Sockets_Info = {};

io.on("connection", Socket => {
    Socket.on("Choose_Chat_Rooms_Display_Name", Data => {
        if (!Data) return;

        Chat_Server_Sockets_Info[Socket.id] = Data;
        Socket.broadcast.emit("Send_Chat_Rooms_Message", {
            Sender: null,
            Content: `<b>${Data}</b> joined the chat room! 👋`
        });
    });

    Socket.on("Send_Chat_Rooms_Message", Data => {
        if (!Data) return;

        Socket.broadcast.emit("Send_Chat_Rooms_Message", {
            Sender: Chat_Server_Sockets_Info[Socket.id],
            Content: Data
        });
    });

    Socket.on("disconnect", () => {
        if (Chat_Server_Sockets_Info[Socket.id]) {
            Socket.broadcast.emit("Send_Chat_Rooms_Message", {
                Sender: null,
                Content: `<b>${Chat_Server_Sockets_Info[Socket.id]}</b> has left the chat room! 👋`
            });
        };

        delete Chat_Server_Sockets_Info[Socket.id];
    });

    Socket.on("Get_Heart_Articles_Table_On_Load", () => {
        Socket.emit("Return_Heart_Articles_Table_After_Load", Articles);
    });
});
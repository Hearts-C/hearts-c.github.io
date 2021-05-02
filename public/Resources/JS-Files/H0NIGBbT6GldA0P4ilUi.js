/*
Heart Developers
*/

window.onload = function () {
    try {
        let Chat_Page_Elements = {
            Root_Container: document.getElementById("Root_Container"),
            JS_Container: document.getElementById("JS"),
        };

        let Server_Connection_Socket = io("http://localhost:8000");
        var Themes_Decode = {
            "FGcnjSun2gc8_key": "light",
            "99nbReI3bd9T_key": "dark"
        };

        function Fallback(What_Went_Wrong) {
            document.body.innerHTML = "";
            document.body.style["background"] = "var(--light_mode_background)";

            var Fallback_Container = document.createElement("div");
            document.body.appendChild(Fallback_Container);
            Fallback_Container.style["margin-left"] = "1vw";
            Fallback_Container.style["margin-top"] = "1.5vh";
            var Fallback_Title = document.createElement("h3");
            Fallback_Container.appendChild(Fallback_Title);
            Fallback_Title.innerHTML = `Fallback.<br>Sorry, but this a fallback message! This means something went wrong.<br><br>What went wrong: <b>${What_Went_Wrong}</b>`;
            Fallback_Title.style["text-align"] = "left";
            Fallback_Title.style["font-weight"] = "lighter";
        }

        function Create_Element(Type, Append, Class_Name) {
            if (!Type || !Append) return;
            if (!Class_Name) Class_Name = "";

            try {
                var Element = document.createElement(Type);
                Append.appendChild(Element);
                Element.className = Class_Name;

                return Element;
            } catch (Error) {
                Fallback("Create_Element(); failed.");

                return;
            };
        }

        function Load_Cookie(Cookie_Name) {
            var Name = Cookie_Name + "=";
            var Decoded_Cookie = decodeURIComponent(document.cookie);
            var Split_Decoded = Decoded_Cookie.split(";");

            for (var Current_Cookie = 0; Current_Cookie < Split_Decoded.length; Current_Cookie++) {
                var Cookie = Split_Decoded[Current_Cookie];

                while (Cookie.charAt(0) == " ") {
                    Cookie = Cookie.substring(1);
                };

                if (Cookie.indexOf(Name) == 0) {
                    return Cookie.substring(Name.length, Cookie.length);
                };
            }

            return "";
        }

        let App_Container = Create_Element("div", Chat_Page_Elements.Root_Container, "App_Container");
        let Messages_Container = Create_Element("div", App_Container, "Messages_Container");
        let Message_Amount = 0;
        let My_Display_Name = "";

        function Message_Element(Data) {
            try {
                if (!Data.Content) Data.Content = "No message content.";

                var Content_Container = Create_Element("div", Messages_Container, "Message_Content_Container");
                var Content = Create_Element("p", Content_Container, "Content");
                Content.innerHTML = `<b>[${Data.Sender}]</b>: ${Data.Content}`;
                Content_Container.style["opacity"] = "0";

                var Theme = Load_Cookie("km67D68lZO");
                Theme = Themes_Decode[`${Theme}_key`];
                if (Theme === "light") {
                    Content_Container.style["background"] = "var(--message_light_background)";
                    Content.style["color"] = "var(--light_labels_text1)";
                } else if (Theme === "dark") {
                    Content_Container.style["background"] = "var(--message_dark_background)";
                    Content.style["color"] = "var(--dark_labels_text1)";
                };

                if (Data.Sender === null || Data.Sender === "") {
                    Content.innerHTML = Data.Content;
                };

                Message_Amount += 1;
                if (Message_Amount > 1) {
                    Content_Container.style["margin-top"] = "5px";
                };

                setTimeout(function() {
                    Content_Container.style["opacity"] = "1";
                }, 250);

                return Content_Container;
            } catch(Error) {
                console.log(Error);
            };
        }

        function Handle_Chat() {
            var Hotbar_Container = Create_Element("div", App_Container, "Message_Hotbar_Container");
            var Message_Input = Create_Element("input", Hotbar_Container, "Message_Input");
            Message_Input.style["transition"] = "0s";
            Message_Input.placeholder = "Message";
            var Send_Message_Button = Create_Element("button", Hotbar_Container, "Send_Button");
            Send_Message_Button.innerText = "Send";
            var Is_Loaded_In_Chat = false;

            function Name_Choose() {
                try {
                    var Container = Create_Element("div", Chat_Page_Elements.Root_Container, "Name_Choose_Container");
                    var Name_Choose_Title = Create_Element("h1", Container, "Container_Title");
                    Name_Choose_Title.innerText = "Choose Your Display Name";
                    var Name_Choose_Input = Create_Element("input", Container, "Name_Input");
                    Name_Choose_Input.placeholder = "Display Name";
                    var Join_Button = Create_Element("button", Container, "Join_Button");
                    Join_Button.innerText = "Join";

                    Join_Button.onclick = function () {
                        if (!Name_Choose_Input.value || !Name_Choose_Input.value.replace(/\s/g, "").length) return;

                        try {
                            Is_Loaded_In_Chat = true;
                            Container.style["opacity"] = "0";
                            Server_Connection_Socket.emit("Choose_Chat_Rooms_Display_Name", Name_Choose_Input.value);
                            My_Display_Name = Name_Choose_Input.value;

                            Message_Element({Sender: null, Content: "You joined. Do <b>/help</b> for help!"});

                            Message_Amount += 1;

                            setTimeout(function () {
                                Container.remove();
                                App_Container.style["display"] = "block";
                                App_Container.style["opacity"] = "1";
                            }, 500);
                        } catch(Error) {
                            Fallback("Failed to send request.");
                        };
                    };

                    App_Container.style["display"] = "none";
                } catch (Error) {
                    Fallback("Failed to load chat setup");
                };
            }

            Server_Connection_Socket.on("Send_Chat_Rooms_Message", Data => {
                if (Is_Loaded_In_Chat) {
                    Message_Element(Data);

                    Messages_Container.scrollTop = Messages_Container.scrollHeight;
                };
            });

            Send_Message_Button.onclick = function () {
                var Content = Message_Input.value;

                if (!Content || !Content.replace(/\s/g, "").length) return;

                if (Content.startsWith("/")) {
                    if (Content.startsWith("/help")) {
                        var Help_Content = 'Thanks for using heart!<br>This is coming soon. If you wish to learn how to use things like bold, newline, etc then read <a href="http://www.tizag.com/htmlT/formattags.php" style="color=#3A649D; text-decoration: none; font-decoration: none;">this</a> article.<br><font style="font-size: 60%; padding-top: 15px;">Only you can see this message</font>';
                        Message_Element({Sender: null, Content: Help_Content});
                    } else if (Content.startsWith("/me")) {
                        Message_Element({Sender: null, Content: `Your display name is <b>${My_Display_Name}</b><br><font style="font-size: 60%; padding-top: 15px;">Only you can see this message</font>`});
                    } else {
                        Message_Element({Sender: null, Content: `<b>${Content}</b> is not a valid command.<br><font style="font-size: 60%; padding-top: 15px;">Only you can see this message</font>`});
                    };
                } else {
                    Message_Element({Sender: "YOU", Content: Content});

                    Server_Connection_Socket.emit("Send_Chat_Rooms_Message", Content);
                };

                Messages_Container.scrollTop = Messages_Container.scrollHeight;
            };

            Messages_Container.scrollTop = Messages_Container.scrollHeight;
            document.title = `Chat | Heart`;
            Name_Choose();
        }

        function Init() {
            Server_Connection_Socket.on("connect_error", function () {
                Fallback("Failed to connect to server.");
            });

            Server_Connection_Socket.on("disconnect", function () {
                Fallback("Server closed connection.");
            });

            Handle_Chat();
        }

        Init();
    } catch (Error) {
        console.log(Error);
        document.body.innerHTML = "";

        var Fallback_Container = document.createElement("div");
        document.body.appendChild(Fallback_Container);
        Fallback_Container.style["margin-left"] = "1vw";
        Fallback_Container.style["margin-top"] = "1.5vh";
        var Fallback_Title = document.createElement("h3");
        Fallback_Container.appendChild(Fallback_Title);
        Fallback_Title.innerHTML = "Server offline.";
        Fallback_Title.style["text-align"] = "left";
        Fallback_Title.style["font-weight"] = "lighter";
    };
};
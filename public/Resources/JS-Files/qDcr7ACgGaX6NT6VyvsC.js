/*
Heart Developers
*/

try {
    let Footer_Bottom_Section_Labels = ["Heart Developers", "Heart ❤️", "Lanred"];
    let Footer_Bottom_Section_Buttons = [{
        Name: "Theme",
        Type: "Theme_Changer"
    }];
    let Header_Buttons = ["Articles", "Drawing Canvas"];

    function Create_Element(Type, Append, Class_Name) {
        if (!Type || !Append) return;
        if (!Class_Name) Class_Name = "";

        try {
            var Element = document.createElement(Type);
            Append.appendChild(Element);
            Element.className = Class_Name;

            return Element;
        } catch (Error) {
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

    function Create_Header() {
        var Header_Container = document.getElementById("Header_Container");


    }

    function Create_Footer() {
        var Themes_Decode = {
            "FGcnjSun2gc8_key": "light",
            "99nbReI3bd9T_key": "dark"
        };
        var Themes_Encode = {
            "light": "FGcnjSun2gc8",
            "dark": "99nbReI3bd9T"
        };

        function Change_Theme(Current_Theme) {
            var New_Theme = "";

            if (Current_Theme === "light") {
                New_Theme = "dark";

                document.body.style["background"] = "var(--dark_mode_background)";
                Footer_Container.style["background"] = "var(--footer_dark_background)";

                if (document.getElementById("Side_Menu_Container")) {
                    document.getElementById("Side_Menu_Container").style["background"] = "var(--article_side_menu_dark_background)";
                };

                var Divider_Items = document.getElementsByClassName("Divider");
                for (var Item = 0; Divider_Items.length > Item; Item++) {
                    Divider_Items[Item].style["color"] = "var(--dark_labels_text1)";
                };

                var Bottom_Label_Items = document.getElementsByClassName("Bottom_Label");
                for (var Item = 0; Bottom_Label_Items.length > Item; Item++) {
                    Bottom_Label_Items[Item].style["color"] = "var(--dark_labels_text1)";

                };

                var Content_Items = document.getElementsByClassName("Content");
                for (var Item = 0; Content_Items.length > Item; Item++) {
                    Content_Items[Item].style["color"] = "var(--dark_labels_text1)";
                };

                var Message_Content = document.getElementsByClassName("Message_Content_Container");
                for (var Item = 0; Message_Content.length > Item; Item++) {
                    Message_Content[Item].style["background"] = "var(--message_dark_background)";
                };
            } else if (Current_Theme === "dark") {
                New_Theme = "light";

                document.body.style["background"] = "var(--light_mode_background)";
                Footer_Container.style["background"] = "var(--footer_light_background)";

                if (document.getElementById("Side_Menu_Container")) {
                    document.getElementById("Side_Menu_Container").style["background"] = "var(--article_side_menu_light_background)";
                };

                var Divider_Items = document.getElementsByClassName("Divider");
                for (var Item = 0; Divider_Items.length > Item; Item++) {
                    Divider_Items[Item].style["color"] = "var(--light_labels_text1)";
                };

                var Bottom_Label_Items = document.getElementsByClassName("Bottom_Label");
                for (var Item = 0; Bottom_Label_Items.length > Item; Item++) {
                    Bottom_Label_Items[Item].style["color"] = "var(--light_labels_text1)";
                };

                var Content_Items = document.getElementsByClassName("Content");
                for (var Item = 0; Content_Items.length > Item; Item++) {
                    Content_Items[Item].style["color"] = "var(--light_labels_text1)";
                };

                var Message_Content = document.getElementsByClassName("Message_Content_Container");
                for (var Item = 0; Message_Content.length > Item; Item++) {
                    Message_Content[Item].style["background"] = "var(--message_light_background)";
                };
            };

            document.cookie = `km67D68lZO=${Themes_Encode[New_Theme]}; expires=Mon, 1 Jan 3030 12:00:00 UTC; path=/`;
            return New_Theme;
        }

        var Footer_Container = Create_Element("div", document.body, "Footer_Container");
        var Bottom_Section = Create_Element("div", Footer_Container, "Bottom_Section");

        for (var Button = 0; Footer_Bottom_Section_Buttons.length > Button; Button++) {
            var Button_Element = Create_Element("button", Footer_Container, "Bottom_Button")
            Button_Element.innerHTML = Footer_Bottom_Section_Buttons[Button].Name;

            if (Label < Footer_Bottom_Section_Buttons.length - 1) {
                var Divider = document.createElement("h5");
                Bottom_Section.appendChild(Divider);
                Divider.className = "Divider";
                Divider.innerText = "|";
            };

            var Button_Type = Footer_Bottom_Section_Buttons[Button].Type;
            if (Button_Type) {
                if (Button_Type === "Theme_Changer") {
                    setTimeout(function () {
                        var Current_Theme = Load_Cookie("km67D68lZO");

                        if (Current_Theme && Current_Theme != "") {
                            Current_Theme = Themes_Decode[`${Current_Theme}_key`];

                            if (Current_Theme === "light") {
                                Change_Theme("dark");
                            } else if (Current_Theme === "dark") {
                                Change_Theme("light");
                            };
                        } else {
                            Current_Theme = "light";
                            document.cookie = `km67D68lZO=${Themes_Encode[Current_Theme]}; expires=Mon, 1 Jan 3030 12:00:00 UTC; path=/`;
                        };

                        Button_Element.onclick = function () {
                            var Theme = Change_Theme(Current_Theme);
                            Current_Theme = Theme;
                        };
                    }, 1000);
                }
            } else {
                Button_Element.delete();
            };
        };

        for (var Label = 0; Footer_Bottom_Section_Labels.length > Label; Label++) {
            var Label_Element = Create_Element("h5", Bottom_Section, "Bottom_Label");
            Label_Element.innerHTML = Footer_Bottom_Section_Labels[Label];

            if (Label < Footer_Bottom_Section_Labels.length - 1) {
                var Divider = document.createElement("h5");
                Bottom_Section.appendChild(Divider);
                Divider.className = "Divider";
                Divider.innerText = "|";
            };
        };
    }

    Create_Footer();
    Create_Header();
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
/*
Heart Developers
*/

window.onload = function () {
  console.log("yes")
  try {
    let Server_Connection_Socket = io("http://localhost:8000");
    let Window_Name = "Articles";

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

    function Load_Article(Article) {
      if (!Article) return;

      try {
        function Load_Side_Menu() {
          for (var Section = 0; Article.Sections.length > Section; Section++) {
            var Button_Container = Create_Element("div", Articles_Page_Elements.Article_Container.Side_Menu_Container, "Button_Container");
            var Center_Container = Create_Element("div", Button_Container, "Center_Container");
            var Button_Element = Create_Element("p", Center_Container, "Content");
            Button_Element.innerHTML = `Sec${Section + 1}`;
          };
        };

        Articles_Page_Elements.Home_Container.Container.style["display"] = "none";
        Articles_Page_Elements.Article_Container.Container.style["display"] = "block"
        window.history.pushState(null, `${Article.Title} | Heart ${Window_Name}`, `?${Article.Title}&type=articles`);

        Load_Side_Menu();

        Articles_Page_Elements.Article_Container.Path_Container.innerHTML = `<font class="Start_Path">Articles</font> > <font class="Current_Path"><a class="Path_Link" href="${document.URL}">${Article.Title}</a></font>`;
        Articles_Page_Elements.Article_Container.Article_Title.innerText = Article.Title;
        var Page_Marker = Create_Element("div", Articles_Page_Elements.Article_Container.Main_Article_Container, "Page_Marker");
        var Marker_Status = Create_Element("h4", Page_Marker);
        Marker_Status.innerText = "1";

        for (var Section = 0; Article.Sections.length > Section; Section++) {
          var Section_Container = Create_Element("div", Articles_Page_Elements.Article_Container.Center_Container, "Section_Container");
          var Content_Element = Create_Element("p", Section_Container, "Content");
          Content_Element.innerHTML = Article.Sections[Section].Content;

          if (Article.Sections[Section].Image && Article.Sections[Section].Image != "") {
            var Image_Container = Create_Element("div", Section_Container, "Image_Container");
            var Image_Element = Create_Element("img", Image_Container, "Image");
            Image_Element.src = Article.Sections[Section].Image;
            Content_Element.style["margin-right"] = "2vw";
            Content_Element.style["width"] = "60%";
            Section_Container.style["display"] = "flex";
          };

          const Hidden = Article.Reveal_Sections;

          if (Section === 0) {
            Section_Container.style["margin-top"] = "3vh";
          };
          if (Section === 0 || Hidden === false) {
            Section_Container.style["filter"] = "blur(0x)";
          } else if (Section > 0 && Hidden === true) {
            Section_Container.style["filter"] = "blur(5px)";
          };
        };
      } catch (Error) {
        Fallback("Failed to load requested article.");
      };
    }

    function Load_Article_Home_Page() {
      var Articles = null;

      function Load_Articles() {
        try {
          Server_Connection_Socket.emit("Get_Heart_Articles_Table_On_Load");

          setTimeout(function () {
            if (!Articles) return Fallback("No server response.");

            for (var Article = 0; Articles.length > Article; Article++) {
              function Run_Load_Selection_Self_Execute() {
                var My_Article = Articles[Article];

                var Article_Selection_Container = Create_Element("div", Articles_Page_Elements.Home_Container.Articles_Container, "Article_Selection_Container");

                if (My_Article.Header_Image != "") {
                  Article_Selection_Container.style["background"] = `linear-gradient(40deg, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${My_Article.Header_Image})`;
                };

                Article_Selection_Container.style["background-size"] = "cover";
                Article_Selection_Container.style["background-position"] = "center";
                Article_Selection_Container.type = "button";
                var Article_Title = Create_Element("h2", Article_Selection_Container, "Article_Title");
                Article_Title.innerText = My_Article.Title;

                if (Article != 0) {
                  Article_Selection_Container.style["margin-top"] = "2vh";
                };

                Article_Selection_Container.onclick = function () {
                  Article_Selection_Container.style["width"] = "100vw";
                  Article_Selection_Container.style["border-radius"] = "0px";
                  Article_Selection_Container.style["margin-left"] = "0vw";

                  setTimeout(function () {
                    Load_Article(My_Article);
                  }, 250);
                };
              };

              Run_Load_Selection_Self_Execute();
            };
          }, 500);
        } catch (Error) {
          Fallback("Failed to load home page.");
        };
      }

      try {
        Server_Connection_Socket.on("Return_Heart_Articles_Table_After_Load", Loaded_Articles => {
          Articles = Loaded_Articles;
        });
      } catch (Error) {
        console.log("Failed to send request for articles.");
      };

      window.history.pushState(null, `Home | Heart ${Window_Name}`, "?home&type=articles");
      Load_Articles();
    }

    function Init() {
      Server_Connection_Socket.on("connect_error", function () {
        Fallback("Failed to connect to server.");
      });

      Server_Connection_Socket.on("disconnect", function () {
        Fallback("Server closed connection.");
      });

      Load_Article_Home_Page();

      window.onpopstate = function (State) {
        if (State.state) {
          window.history.pushState(null, `Home | Heart ${Window_Name}`, "?home&type=articles");
        };
      };
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
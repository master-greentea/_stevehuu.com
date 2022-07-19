// STUFF MACHINE
// by stevehuu 2022

$(function () {
  // ✨VERSION NUMBER
  var vNo = "0.7.0"
  $(".sm-version-no").html(vNo);

  $("#sm-loading-date").html(
    new Date(Date.now()).getFullYear() +
      "" +
      (new Date(Date.now()).getMonth() + 1) +
      "" +
      new Date(Date.now()).getDate()
  );

  // initialize
  let fullscreened = false;

  var minResizeW = $(window).width() / 4;
  var minResizeH = $(window).height() / 3;

  var onStartMenu = false;

  // !!!!!!![[[[[[[[[UPDATE]]]]]]]]!!!!!!!
  var update = setInterval(() => {
    // full screen check
    if (!fullscreened) {
      $(".window").draggable({
        disabled: false,
        containment: "#stuff-space",
        scroll: false,
        stack: ".window",
        handle: ".window-controls",
      });

      $(".window-content").resizable({
        disabled: false,
        maxHeight: $(window).height() - 68, // vh - (task bar + 29)
        maxWidth: $(window).width() - 100,
        minHeight: $(window).height() / 3,
        minWidth: $(window).width() / 4,
      });
    } else {
      $(".window").draggable("disable");
      $(".window-content").resizable("disable");
    }

    // check start menu hover
    if ($("#start-menu:hover").length != 0) {
      onStartMenu = true;
    } else {
      onStartMenu = false;
    }
  }, 10);

  // [[[[[[[[[LOAD WINDOW CONTROLS]]]]]]]]
  // with fullscreen
  $(".fs").load("/stuff_machine/window_controls_fs.html", function () {
    // using toggle button
    $(this)
      .find(".window-toggle-button")
      .click(function () {
        toggleFullscreen(this);
      });

    // using double click controls panel
    $(this).dblclick(function () {
      toggleFullscreen(this);
    });

    $(this)
      .find(".window-close-button")
      .click(function () {
        $(this).closest(".window").hide();
        if (fullscreened) {
          unFullscreen(this);
        }
      });
  });
  // no fullscreen
  $(".no-fs").load("/stuff_machine/window_controls_nofs.html", function () {
    $(this).off("dblclick"); // disable double click fullscreen
    $(this)
      .find(".window-close-button")
      .click(function () {
        $(this).closest(".window").hide();
        if (fullscreened) {
          unFullscreen(this);
        }
        $(this).closest(".window").find("iframe").attr("src", "");
        $(this).closest(".window").find("audio").attr("src", "");
        $(this).closest(".window").find("video").attr("src", "");
      });
  });
  // ==========================================FULLSCREENING=========================
  // save position before fullscreening
  var saveTempT;
  var saveTempL;
  var saveTempW;
  var saveTempH;
  var fullScreenAnimSpeed = 450;
  // full screening
  function fullscreen(thing) {
    saveTempT = $(thing).closest(".window").css("top");
    saveTempL = $(thing).closest(".window").css("left");
    saveTempW = $(thing).closest(".window").css("width");
    saveTempH = $(thing)
      .closest(".window")
      .find(".window-content")
      .css("height");

    $(thing).closest(".window").css({
      position: "absolute",
    });
    $(thing)
      .closest(".window")
      .animate(
        {
          top: $(window).scrollTop(), // + 79 (if header)
          left: "0",
          width: "100%",
        },
        fullScreenAnimSpeed,
        "easeOutQuad"
      );

    $(thing)
      .closest(".window")
      .find(".window-content")
      .animate(
        {
          top: -1,
          left: 0,
          width: "100%",
          height: $(window).height() - 69,
        },
        fullScreenAnimSpeed,
        "easeOutQuad"
      );

    // set icon to subtract
    $(thing)
      .closest(".window")
      .find(".window-toggle-button")
      .html(
        "<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='#f8f2e2' viewBox='0 0 16 16'><path d='M0 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v2h2a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-2H2a2 2 0 0 1-2-2V2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H2z' /></svg>"
      );
    // other window's buttons disable
    $(".window-toggle-button")
      .not($(thing).closest(".window").find(".window-toggle-button"))
      .attr("disabled", true);
    fullscreened = true;
  }
  // un- full screening
  function unFullscreen(thing) {
    $(thing).closest(".window").css({
      position: "absolute",
    });
    $(thing).closest(".window").animate(
      {
        top: saveTempT,
        left: saveTempL,
        width: saveTempW,
      },
      fullScreenAnimSpeed,
      "easeOutQuad"
    );
    $(thing).closest(".window").find(".window-content").animate(
      {
        top: 0,
        left: 0,
        width: saveTempW,
        height: saveTempH,
      },
      fullScreenAnimSpeed,
      "easeOutQuad"
    );

    setTimeout(function () {
      $(thing)
        .closest(".window")
        .attr(
          "style",
          $(thing)
            .closest(".window")
            .attr("style")
            .replace("width: " + saveTempW, "width: max-content !important")
        );
      console.log("width: " + saveTempW);
    }, fullScreenAnimSpeed + 1);

    // set icon to square
    $(thing)
      .closest(".window")
      .find(".window-toggle-button")
      .html(
        "<svg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='#f8f2e2' viewBox='0 0 16 16'><path d='M14 1a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h12zM2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2z'/></svg>"
      );
    // button enable
    $(".window-toggle-button")
      .not($(thing).closest(".window").find(".window-toggle-button"))
      .attr("disabled", false);
    fullscreened = false;
  }
  // toggle fullscreen
  function toggleFullscreen(thing) {
    if (!fullscreened) {
      fullscreen(thing);
    } else {
      unFullscreen(thing);
    }
  }
  // ==========================================FULLSCREENING=========================

  // select window
  function selectWindow(windowToSelect) {
    $(windowToSelect).addClass("front");
    $(".window").not(windowToSelect).removeClass("front");
    $(windowToSelect)
      .find(".window-controls")
      .css("box-shadow", "0px 5px 30px #f2c94d inset");
    $(".window")
      .not(windowToSelect)
      .find(".window-controls")
      .css("box-shadow", "none");
  }
  function deselectWindow() {
    $(".window").removeClass("front");
    $(".window").find(".window-controls").css("box-shadow", "none");
  }

  $("body").mousedown(function (event) {
    // WINDOW SELECTION
    if ($(event.target).closest(".window").hasClass("window")) {
      selectWindow($(event.target).closest(".window"));
    } else {
      deselectWindow();
    }

    // START MENU TOGGLE
    if (event.target.id == "#start-menu-button") {
      return;
    } else if ($(event.target).closest("#start-menu-button").length) {
      return;
    } else if (!onStartMenu) {
      startMenuClose();
    }
  });

  // [[[[[[[[[TASK BAR]]]]]]]]
  // ==========================================START MENU=========================
  var startMenuOpened = false;
  function startMenuOpen() {
    var newHeight = $(window).height() - 340;
    $("#start-menu").animate({ top: newHeight }, 350, "easeOutQuad");
    startMenuOpened = true;
  }
  function startMenuClose() {
    $("#start-menu").animate({ top: "100vh" }, 350), "easeOutQuad";
    startMenuOpened = false;
  }

  // click button to open / close
  $("#start-menu-button").click(function () {
    if (startMenuOpened) {
      startMenuClose();
    } else {
      startMenuOpen();
    }
  });

  // >>>>start menu buttons
  $("#shut-down").click(function () {
    $("#start-menu").css("z-index", "-1"); // menu make unclickable
    $("#header-pullout").fadeOut(300); // hide pull out button
    $(".apps").animate({ opacity: "0" }, 100); // hide apps
    $("#sm-desktop").animate(
      {
        height: "102%",
        width: "98%",
        top: "-=1%",
        left: "+=1%",
      },
      150
    ); // animate full desktop - shrink
    $("#sm-desktop").animate(
      {
        height: "0%",
        top: "+=51%",
      },
      900
    ); // animate full desktop - collapse
    $("#task-bar").animate({ backgroundColor: "#f23e3e" }, 600); // change task bar color
    $("#stuff-space").animate({ backgroundColor: "#f23e3e" }, 600); // change stuff space color
    $("#sm-desktop").hide(150); // hide full desktop
    setTimeout(function () {
      $("#sm-restart").fadeIn(1500);
    }, 1100); // display restart button
  });
  $("#sm-restart img").mouseover(function () {
    var randomAngle = Math.floor(Math.random() * 355) + 5;
    $(this).rotate({
      animateTo: randomAngle,
    });
  });
  $("#sm-restart img").click(function () {
    window.location.reload(true)
  });
  $("#reboot").click(function () {
    window.location.reload(true)
  });
  // ==========================================START MENU=========================

  // >>>> task bar time
  var taskBarTime = setInterval(() => {
    $("#tb-time").html(
      new Date(Date.now()).getHours() +
        ":" +
        new Date(Date.now()).getMinutes() +
        ":" +
        new Date(Date.now()).getSeconds()
    );
  }, 1000);

  // [[[[[[[[[APPS]]]]]]]]
  // >>>>
  //app open
  function appOpen(
    type,
    windowId,
    windowWidth,
    windowHeight,
    windowName,
    windowContent
  ) {
    $(windowId).fadeIn(100);

    var randomLeft = Math.random() * $(window).width();
    var randomTop = Math.random() * $(window).height();
    if (
      randomLeft > $(window).width() / 2 ||
      randomTop > $(window).height() / 2
    ) {
      randomLeft /= 3;
      randomTop /= 3;
    }
    $(windowId).css({
      left: randomLeft,
      top: randomTop,
    });
    $(windowId).find(".window-content").css({
      width: windowWidth,
      height: windowHeight,
    });

    selectWindow(windowId);

    $(windowId).find(".window-header-text").html(windowName);

    setTimeout(function () {
      $(windowId).attr(
        "style",
        $(windowId)
          .closest(".window")
          .attr("style")
          .replace("width: " + windowWidth, "width: max-content !important")
      );
    }, 100 + 1);

    // window type: TEXT
    if (type == ".window-content-text") {
      $(windowId)
        .find(".window-content-text")
        .load(windowContent, function () {
          $(".sm-version-no").html(vNo);
        });
    }
    // window type: FOLDER
    if (type == ".window-content-folder") {
      $(windowId)
        .find(".window-content-folder")
        .load(windowContent, function () {
          if (windowId == "#audio-folder") {
            audioFolderActivate();
          }
          if (windowId == "#visual-folder") {
            audioFolderActivate();
          }

          $(this).append("<script>function selectWindow(windowToSelect) { $(windowToSelect).addClass('front'); $('.window').not(windowToSelect).removeClass('front'); $(windowToSelect) .find('.window-controls') .css('box-shadow', '0px 5px 30px #f2c94d inset'); $('.window') .not(windowToSelect) .find('.window-controls') .css('box-shadow', 'none'); } function mediaOpen(type, clipToPlay) { $('#audio-viewer').hide(); $('#video-viewer').hide(); $('#audio-clip').attr('src', ''); $('#video-clip').attr('src', ''); $('#media-viewer').fadeIn(100); var randomLeft = Math.random() * $(window).width(); var randomTop = Math.random() * $(window).height(); if ( randomLeft > $(window).width() / 2 || randomTop > $(window).height() / 2 ) { randomLeft /= 3; randomTop /= 3; } $('#media-viewer').css({ left: randomLeft, top: randomTop, }); var lastPart = clipToPlay.split('/').pop(); $('#media-viewer').find('.window-header-text').html(lastPart); selectWindow('#media-viewer'); if (type == 'audio') { $('#audio-viewer').show(); $('#audio-clip').attr('src', clipToPlay); } if (type == 'video') { $('#video-viewer').show(); $('#video-clip').attr('src', clipToPlay); } } </script>")
        });
    }
  }
  // >>>>
  // folder open
  var backSvg =
    "<svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' fill='#f8f2e2' viewBox='0 0 16 16'><path d='M4.854 1.146a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L4 2.707V12.5A2.5 2.5 0 0 0 6.5 15h8a.5.5 0 0 0 0-1h-8A1.5 1.5 0 0 1 5 12.5V2.707l3.146 3.147a.5.5 0 1 0 .708-.708l-4-4z'/></svg>";
  // depth 2
  function folderOpenL2(
    thisId,
    parentId,
    lastLvlId,
    nextLvlId,
    parentName,
    lastLvlName,
    nextLvlName
  ) {
    $(thisId).closest(".folder-lvl-1").hide();
    $(thisId).closest(".folder-lvl-2").hide();
    $(nextLvlId).show();

    // path
    if (lastLvlId == parentId) {
      $(nextLvlId)
        .closest(".window")
        .find(".folder-path")
        .html(
          "<inline class='folder-back-button'>" +
            backSvg +
            lastLvlName +
            "</inline>/" +
            nextLvlName
        );
    } else {
      $(nextLvlId)
        .closest(".window")
        .find(".folder-path")
        .html(
          "<inline class='folder-back-button'>" +
            backSvg +
            parentName +
            "</inline>/" +
            "<inline class='folder-back-button-lvl2'>" +
            lastLvlName +
            "</inline>/" +
            nextLvlName
        );

      $(".folder-back-button-lvl2").click(function () {
        folderBack(false, parentId, nextLvlId, lastLvlId, nextLvlName);
      });
    }

    $(".folder-back-button").click(function () {
      folderBack(true, parentId, nextLvlId, parentId);
    });
  }
  function folderBack(
    isBackToParent,
    parentId,
    currentId,
    backToId,
    currentName
  ) {
    $(currentId).hide();

    if (isBackToParent) {
      $(currentId).closest(".window").find(".folder-path").html("");
      $(parentId).show();
    } else {
      // get current path
      var current = $(currentId).closest(".window").find(".folder-path").html();
      // chang path
      $(currentId)
        .closest(".window")
        .find(".folder-path")
        .html(current.replace("/" + currentName, ""));
      // reset first back button
      $(".folder-back-button").click(function () {
        folderBack(true, parentId, backToId, parentId);
      });
      $(backToId).show();
    }
  }

  // apps individual
  $("#app-about").click(function () {
    appOpen(
      ".window-content-text",
      "#about-window",
      minResizeW,
      minResizeH,
      "About Stuff Machine",
      "/stuff_machine/start_menu_windows/about_window.html"
    );
    startMenuClose();
  });
  $("#app-legal").click(function () {
    appOpen(
      ".window-content-text",
      "#legal-window",
      minResizeW,
      minResizeH,
      "Terms & Conditions",
      "/stuff_machine/start_menu_windows/legal_window.html"
    );
    startMenuClose();
  });
  $("#app-bug").click(function () {
    appOpen(
      ".window-content-text",
      "#bug-window",
      minResizeW,
      minResizeH,
      "Bug Report",
      "/stuff_machine/start_menu_windows/bug_window.html"
    );
    startMenuClose();
  });

  $("#app1-venera").dblclick(function () {
    appOpen("", "#venera-window", minResizeW, minResizeH, "venera.script", "");
  });
  $("#app2-photo").dblclick(function () {
    appOpen(
      "",
      "#photo-window",
      $(window).width() / 2,
      $(window).height() / 2,
      "photos.html",
      ""
    );
    $("#photo-window").find("iframe").attr("src", "/stuff_machine/photos.html");
  });
  $("#app3-audio").dblclick(function () {
    appOpen(
      ".window-content-folder",
      "#audio-folder",
      minResizeW,
      minResizeH,
      "audio",
      "/stuff_machine/folder_windows/audio_window.html"
    );
  });
  $("#app4-visual").dblclick(function () {
    appOpen(
      ".window-content-folder",
      "#visual-folder",
      minResizeW,
      minResizeH,
      "visual",
      "/stuff_machine/folder_windows/visual_window.html"
    );
  });
  $("#app5-titanpoint").dblclick(function () {
    appOpen(
      "",
      "#titanpoint-window",
      minResizeW,
      minResizeH,
      "titanpoint(webgl).exe",
      ""
    );
    $("#titanpoint-window")
      .find("iframe")
      .attr("src", "https://stevehuu.com/webgl/u_titanpoint/index.html");
  });

  var audioFolderActivate = function () {
    // level 1
    $("#audio-songs").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-parent",
        "#audio-songs-content",
        "audio",
        "audio",
        "songs"
      );
      // TESTopener();
    });
    $("#audio-games").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-parent",
        "#audio-games-content",
        "audio",
        "audio",
        "from-games"
      );
    });
    $("#audio-other").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-parent",
        "#audio-other-content",
        "audio",
        "audio",
        "other"
      );
    });
    // level 2 - games
    $("#games-ritual").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-games-content",
        "#games-ritual-content",
        "audio",
        "from-games",
        "ritual-night"
      );
    });
    $("#games-live").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-games-content",
        "#games-live-content",
        "audio",
        "from-games",
        "live-cube"
      );
    });
    $("#games-anamnesis").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-games-content",
        "#games-anamnesis-content",
        "audio",
        "from-games",
        "anamnesis"
      );
    });
    $("#games-space").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-games-content",
        "#games-space-content",
        "audio",
        "from-games",
        "space-game"
      );
    });
    $("#games-sanctum").dblclick(function () {
      folderOpenL2(
        this,
        "#audio-parent",
        "#audio-games-content",
        "#games-sanctum-content",
        "audio",
        "from-games",
        "sanctum"
      );
    });
  };
});
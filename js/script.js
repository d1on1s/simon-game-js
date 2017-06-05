$(function() {
  function Game() {
    var level = 0;
    var step = 1;
    var classToggled = 1;
    var combination = [];
    var handler;
    var userLevel = 0;
    var strict = 0;

    function generateStep() {
      min = Math.ceil(1);
      max = Math.floor(4);
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function reproduceSteps() {
      var classCodes = [["btn-success", "btn-outline-success"], ["btn-info", "btn-outline-info"], ["btn-warning",
      "btn-outline-warning"], ["btn-danger", "btn-outline-danger"]];
      $("#b"+combination[step-1].toString()).toggleClass(classCodes[combination[step-1]-1][0])
        .toggleClass(classCodes[combination[step-1]-1][1]);
      classToggled *= -1;
      if (classToggled == 1) {
        step++;
      } else {
        $("#a"+combination[step-1].toString())[0].play();
      }
      if (step > level) {
        step = 1;
        clearInterval(handler);
      }
    }

    this.status = 0; // 0 - normal; 1 - repeat

    this.nextStep = function() {
      var newStep = generateStep();
      combination.push(newStep);
      level++;
      $("#level").html("Level " + level);
      userLevel = 0;
      handler = setInterval(function(){
        reproduceSteps();
      }, 500);
    }

    this.getLevel = function() {
      return level;
    }

    this.checkStep = function(num) {
      if (num == combination[userLevel]) {
        userLevel++;
        return 1;
      }
      else {
        userLevel = 0;
        return 0;
      }
    }

    this.getUserLevel = function() {
      return userLevel;
    };

    this.setUserLevel = function(num) {
      userLevel = num;
    }

    this.repeat = function() {
      handler = setInterval(function(){
        reproduceSteps();
      }, 500);
    }
  }

  var game = new Game();

  $(".play").attr("disabled", false);
  $("#level").css("visibility", "hidden");

  $("#control").click(function() {
    if (game.status === 0) {
      if ($("#mode").prop("checked")) {
        game.strict = 1;
      }
      game.nextStep();
    }
    if (game.status == 1) {
      game.repeat();
    }

    $(this).css("visibility", "hidden");
    $(".strict").css("visibility", "hidden");
    game.status = 0;
    $(".play").attr("disabled", false);
    $("#level").css("visibility", "visible");
    $("#level").html("Level " + game.getLevel());
  });

  $(".play").click(function() {
    $("#a"+$(this).attr("id").slice(1))[0].play()
    var id = parseInt($(this).attr("id").slice(1));
    var result = game.checkStep(id);
    if (result === 0) {
      $(".play").attr("disabled", true);
      if (game.strict == 1) {
        setTimeout(function() {
          $("#gameover")[0].play();
          $("#control").html("Restart game");
          $("#control").css("visibility", "visible");
          $(".strict").css("visibility", "visible");
          $("#level").html("Game over :(");
          game = new Game();
        }, 700);
      } else {
        setTimeout(function() {
          $("#fail")[0].play();
          $("#control").html("Restart level");
          $("#control").css("visibility", "visible");
          $("#level").html(":(");
        }, 700);
        game.status = 1;
      }
    } else {
      if (game.getLevel() == game.getUserLevel()) {
        if (game.getLevel() == 20) {
          setTimeout(function() {
            $("#final")[0].play();
            $("#level").html("Congratulations! You are the winner!");
            $("#control").html("Play again!");
            $("#control").css("visibility", "visible");
            $(".strict").css("visibility", "visible");
            game = new Game();
          }, 700);
        } else {
          $(".play").attr("disabled", true);
          setTimeout(function() {
            $("#success")[0].play();
            $("#level").html(":)");
            $("#control").html("Next level!");
            $("#control").css("visibility", "visible");
          }, 700);
        }
      }
    }
  });
});

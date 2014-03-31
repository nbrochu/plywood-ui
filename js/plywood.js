(function($) {

  window.Plywood = {
    socket: null,
    previouslyConnected: false,

    init: function() {
      this.events.bind();
    },

    connectWebSocket: function() {
      var self = this;

      var host = $(".plywood-host").val() || 'localhost';
      var port = $(".plywood-port").val() || '17998';
      
      ab.connect("ws://" + host + ":" + port,
        function(session) {
          self.socket = session;
          self.onSocketConnect();
        },

        function(code, reason) {
          $(".plywood-connection").removeClass("plywood-connected-yes").addClass("plywood-connected-no");
          
          $(".plywood-error-message").html(reason);
          $(".plywood-error-alert").show();
        }
      );
    },

    onSocketConnect: function() {
      this.previouslyConnected = true;
      this.socket.subscribe("plywood#plywood", window.Plywood.pubSubOnMessage);

      $(".plywood-connection").removeClass("plywood-connected-no").addClass("plywood-connected-yes");

      $(".plywood-first-load-alert").hide();
      $(".plywood-error-alert").hide();
    },

    pubSubOnMessage: function(e,m) {
      var message = JSON.parse(m);
      console.log(message);

      $(".plywood-well pre").text($(".plywood-well pre").text() + message.message);

      $(".plywood-well").scrollTop($(".plywood-well pre").height());
    },

    events: {
      bind: function() {
        $(".plywood-connect").on("click", function(e) {
          try {
            window.Plywood.connectWebSocket();
          }
          catch(error) {console.log(error);}
        });
      }
    }
  };

}) (jQuery);
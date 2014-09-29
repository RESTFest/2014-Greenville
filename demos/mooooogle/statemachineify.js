// TODO: make this into a requirable module

function statemachineify(that, model, actions, guards) {
    require(["scion.js"],function(scion){
      $(document).ready(function() {
        scion.urlToModel(model, function(err,model){
          if(err) throw err;

          //instantiate the interpreter
          var interpreter = new scion.SCXML(model);
          console.log("panel XML ready!");
          that.signal = function(name, data) {
            interpreter.gen(name, data);
          }

          interpreter.registerListener({
            "onEntry" : function(state) {
              //console.log("Entered", state);
              that.classList.add("state-" + state);
              that.dispatchEvent(new CustomEvent('internal-state',  {"detail" : state } ));
            },
            "onExit" : function(state) {
              that.classList.remove("state-" + state);
            },
            "onTransition" : function(state,transition) {
              // console.log("Transitioned", state,"->",transition);
            }
          });
          //start the interpreter
          interpreter.start();

          // send the init event
          that.signal("init", {guards:guards,actions:actions});

        });

      });
    });
}

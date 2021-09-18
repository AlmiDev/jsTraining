const express = require('express');
const config = require('./assets/config.json');
const axios = require('axios');
const qs = require('qs');

const app = express()
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

var messageAnswer;
var language;
var firstname;
var idLOC;
var locAnswer;
var apitoken = 'Bearer e73d7e79ec51c142d839c039622eba50'; 

var data = qs.stringify({   
});

var phoneNumber = "33664665619";
var urlReqPAT = 'https://dev.medylio.app/version-test/api/1.1/obj/DB_PAT?constraints=[ { "key": "phone_trim", "constraint_type": "equals", "value": "'+phoneNumber+'" } ]' ;



let bubblePAT = {
    method: 'get',
    //url: 'https://dev.medylio.app/version-test/api/1.1/obj/DB_PAT?constraints=[ { "key": "phone_trim", "constraint_type": "text contains", "value": "33664665619" } ]',
    url: urlReqPAT,
    headers: { 
      'Authorization': apitoken
    }
    //data : data
  };

var bubbleLOC;
  
  axios(bubblePAT)
  .then((response) => {
    var answer = response.data;
    var isFind = (answer.response.count>0)
    
    if ( isFind === true ) {
        console.log (answer.response.count);
        console.log (isFind);
        //console.log (response)
        console.log (answer.response.results[0].fullName);
        //
        // gestion de la langue
        language = answer.response.results[0].language;
        firstname = answer.response.results[0].firstname;
        idLOC = answer.response.results[0].id_LOC_init;
        
        //récupération du nom de la pharmacie
        //var urlReqLOC;
        //var urlReqLOC = 'https://dev.medylio.app/version-test/api/1.1/obj/DB_LOC?constraints=[ { "key": "id_LOC", "constraint_type": "equals", "value": 30 } ]' ;
        var urlReqLOC = 'https://dev.medylio.app/version-test/api/1.1/obj/DB_LOC?constraints=[ { "key": "id_LOC", "constraint_type": "equals", "value": '+idLOC+' } ]' ;
        bubbleLOC = {
            method: 'get',
            url: urlReqLOC,
            //url : 'https://dev.medylio.app/version-test/api/1.1/obj/DB_LOC?constraints=[ { "key": "id_LOC", "constraint_type": "equals", "value": 30 } ]' ,
            headers: { 
              'Authorization': apitoken
            }
            //data : data
          };

          axios(bubbleLOC)
            .then((response2) => {
                console.log (response2.data.response);
                locAnswer = response2.data;
                console.log(locAnswer.response.results[0].Slug);
            })
            .catch((error2) => {
            console.log(error2);
            });



        //

        switch (language) {
            case 'fr_fr' :
                messageAnswer = 'Bonjour '+firstname+', Votre centre de santé revient vers vous rapidement. Bonne journée.';
                break;
            case 'pt_pt' :
                messageAnswer = 'Olà '+firstname+', o seu centro de saúde responder-lhe-á em breve. Tenha um bom dia.';
                break;
            case 'es_es' :
                messageAnswer = 'Hola '+firstname+', su centro de salud se pondrá en contacto con usted en breve. Que tenga un buen día.';
                break;
            default :
                messageAnswer = 'Hello '+firstname+', your health center will get back to you shortly. Have a nice day.';
          }

    } else {
        messageAnswer = "Bonjour, merci pour votre message, malheureusement nous ne nous connaissons pas encore. Veuillez vous rapprocher d'un centre de santé partenaire : www.medylio.com) --  Hello, thank you for your message, unfortunately we don't know each other yet. Please contact a partner health center: www.medylio.com.)";
        //console.log ("not found");
    }
    console.log (messageAnswer);
  })
  .catch((error) => {
    console.log(error);
  });


//creation du serveur
app.listen (config.port, () => console.log ('Started training Medylio on port '+config.port))
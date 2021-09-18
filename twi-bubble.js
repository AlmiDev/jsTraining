
const express = require('express');
const config = require('./assets/config.json');
const axios = require('axios');
const twilio = require('twilio');
const qs = require('qs');


const app = express()

app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

var data = qs.stringify({   
});



console.log ('toto')


let bubble = {
    method: 'get',
    url: 'https://dev.medylio.app/version-test/api/1.1/obj/DB_PAT?constraints=[ { "key": "phone_red", "constraint_type": "equals", "value": "33664665619" } ]',
    headers: { 
      'Authorization': 'Bearer e73d7e79ec51c142d839c039622eba50'
    },
    data : data
  };
  
  axios(bubble)
  .then((response) => {
    let prenom = response.data.json(results[0].firstname);
   
    console.log prenom;

    
   // console.log(JSON.stringify(response.data.results[0]));
    //console.log("--");
    
    //console.log(JSON.stringify(response.data[0].firstname));
//console.log (data);
/*
    response.data.forEach((result) =>{
        console.log result.firstname
    })
    /*
    response.results.array.map((result) => {
        return result.firstname
        console.log (result.firstname)
    })
*/
    //console.log("--");
    //console.log(JSON.stringify(response.data.results[1].firstname));
    //console.log("--");
    //console.log(JSON.stringify(response.data.count));
  })
  .catch((error) => {
    console.log(error);
  });
  







//creation du serveur
app.listen (config.port, () => console.log ('Started training Medylio on port '+config.port))

//getUser()
//const test = getUser() 
//console.log(test.data.result)
/*
async function getUser() {
    try {
      const response = await axios.get('http://localhost:8080/api/v1/members');
      //console.log(response)
      console.log(response.data.result);
    } catch (error) {
      console.error(error);
    }
  }




  function combiende (nom, ...params) {
      console.log ('on a compté '+ params.length +' '+nom )
  }

  combiende('patates', 'un', 'deux', 'trois')
//

*/


const express = require('express');
const config = require('./assets/config.json');
var Airtable = require('airtable');


const app = express();
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


var base = new Airtable({apiKey: 'keyuossHOfsqGWc7W'}).base('appOlkVKPO07ZE7A5');
var phoneNumber = "+33664665619";
var filter = "phonenumber = '"+phoneNumber+"'"
console.log (filter);


base('PAT_AT')
    .select({
    // Selecting the first 3 records in Grid view:
    //maxRecords: 3,
    //view: "Grid view"
    //filterByFormula : "phonenumber = '+33664665619'"
    filterByFormula : filter
    })



    .firstPage(function(err, records) {
        console.log("--");
       // console.log(records)
       var language;
       var isEmpty = ( Object.keys(records).length===0 );
       console.log (isEmpty);
       console.log("Is Object 1 Empty? : ", Object.keys(records).length===0); 

       if (err) { console.error(err); return; }
        if (isEmpty === false)  {
            records.forEach(function(record) {
                language = record.get('language');
                console.log(language);
                
                switch (language) {
                    case 'fr_fr' :
                        console.log('fr', record.get('fullname'));
                        break;
                    case 'pt_pt' :
                        console.log('pt', record.get('fullname'));
                        break;
                    case 'es_es' :
                        console.log('es', record.get('fullname'));
                        break;
                    default :
                        console.log('en', record.get('fullname'));
                }
                
                //console.log('Retrieved', record.get('fullname'));
            });
        } else {
            console.log('not found');
        }
        
    });
//});

app.listen (config.port, () => console.log ('Started Airtable test on port '+config.port))
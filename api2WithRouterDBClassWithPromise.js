const express = require('express')
//const expressOasGenerator = require('express-oas-generator');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./assets/swagger.json');
const morgan = require('morgan')('dev')
//const mysql = require('mysql');
const mysql = require('promise-mysql')
const config = require('./assets/config.json')
//const funcValid = require('functionsAPI')
const {success, error, checkAndChange} = require('./assets/functionsAPI') // cré un objet avec les 2 cvariables ce qui permet d'alléger le code en enlevant le nom de fonction à la base (funcValid)
const app = express()

mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
  }).then((db) =>{
    console.log('Connected to DB');

    const app=express()
    app.use(config.routeAPI+'api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    //expressOasGenerator.init(app, {}); // to overwrite generated specification's values use second argument.
    let MemberRouter = express.Router()
////////////////////////////
    let Members = require('./assets/classes/members-class')(db, config)
    //console.log(Members.getConfig())


            //app.use(morgan('dev'))
            //pour récupération des données de post
            app.use(express.json()) // for parsing application/json
            app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
            
            MemberRouter.route('/:id')
            
                .get (async (req,res) => {
                    let member = await Members.getById(req.params.id)
                    //res.json(isErr(member) ? error(member.message) : success(member)) // fonction ternaire lance la fonction is Err, si vrai alors error, sinon (donc boolean = false) on renvoie le résultat
                    res.json(checkAndChange(member))
                })
            
                .put (async (req, res) => {  //modification d'un élément
                    let updateMember = await Members.update(req.params.id,req.body.name)
                    res.json(checkAndChange(updateMember))
                })
            
                .delete(async (req, res) => { //modif d'un élément
                    let deleteMember = await Members.delete(req.params.id)
                    res.json(checkAndChange(deleteMember))             
                })  
            
            MemberRouter.route('/')
                
                .get (async (req,res) => {
                    console.log('call class with max'+req.body.max)

                    //let allMembers = await Members.getAll(req.body.max)
                    let allMembers = await Members.getAll(req.params.max) //passage en url
                    //res.json(success(allMembers))
                    res.json(checkAndChange(allMembers))
                })
            
                .post (async (req,res) => {
                    let addMember = await Members.add(req.body.name)
                    res.json(checkAndChange(addMember))
                    
                })
            
            app.use(config.routeAPI+'members', MemberRouter)
            app.listen (config.port, () => console.log ('Started new on port 8080.'))



  }).catch((err) => {
      console.log('error during database connection :')
      console.log(err.message)

  })
  





/* avant de passer en module
function success(result) {
    return {
        status : 'success',
        result : result
    }
}

function error(message) {
    return {
        status : 'error',
        message : message
    }
}
*/

/*
slice permet de couper un tableau

req.query.x va chercher le paramètre x passer en url
--
convention de réponse : se donner un format type pour tout ce que l'on fait 
exemple tout passer en format json -> res.json envoi une réponse en json (au lieu de res.send)

autre convention - établier une fonction de succés -> functon success 
logique un peu de callback, la fonction renvoie le résultat attendu en cas de réussite., en cas de réussite, renvoie donc result, en l'occurence ici le tableau members qu'on lui aura passé en paramètre
*/
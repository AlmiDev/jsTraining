const express = require('express')
const morgan = require('morgan')('dev')
const mysql = require('mysql');
const config = require('./assets/config.json')
//const funcValid = require('functionsAPI')
const {success, error} = require('./assets/functionsAPI') // cré un objet avec les 2 cvariables ce qui permet d'alléger le code en enlevant le nom de fonction à la base (funcValid)
const app = express()

const db = mysql.createConnection({
    host     : config.db.host,
    user     : config.db.user,
    password : config.db.password,
    database : config.db.database
  });
  
  //conexion à la base
  db.connect(function(err) {
    if (err) {
      //console.error('error connecting: ' + err.stack);
      console.log(err.message)
      return;
    } else {
        console.log('connected as id ' + db.threadId);
        let MemberRouter = express.Router()
////////////////////////////
        let Members = require('./assets/classes/members-class')(db, config)
        console.log(Members.getConfig())


                //app.use(morgan('dev'))
                //pour récupération des données de post
                app.use(express.json()) // for parsing application/json
                app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
                
                MemberRouter.route('/:id')
                
                    .get ((req,res) => {
                        //res.send(members[req.params.id-1].name)
                        // -> passage au format json res.send-> res.json
                        //res.json(members[req.params.id-1].name)
                        //gestion du success en cas de réussite pour renvoyer un statut
                        //res.json(funcValid.success(members[req.params.id-1].name))
                        //res.json(success(members[req.params.id-1].name)) // ne fonctionne que tant que l'on a un truc à la base, en cas de modif, ajout ou suppression ce n'es tplsu bon, on va donc chercher la valeur de l'index via getIndex
                
                        db.query ('SELECt * FROM members WHERE id= ?', [req.params.id], (err, result) => {
                            if (err) {
                                res.json(error(err.message))
                            } else {
                                if (result[0] != undefined) {
                                    res.json(success(result[0]))
                                } else {
                                    res.json(error('id not exist'))
                                }
                                
                            }
                        })
                        
                    })
                
                    .put ((req, res) => {  //modification d'un élément
                        
                        if (req.body.name) {
                            db.query ('SELECt * FROM members WHERE id= ?', [req.params.id], (err, result) => {
                                if (err) {
                                    res.json(error(err.message))
                                } else {
                                    if (result[0] != undefined) {
                                        
                                        db.query('SELECT * FROM members WHERE name = ? AND id != ?', [req.body.name, req.params.id], (err, result) => {
                                            if (err) {
                                                res.json(error(err.message))
                                            } else {
                                                if (result[0] != undefined) {
                                                    res.json(error('name already exists'))
                                                } else {
                                                    db.query('UPDATE members SET name = ? WHERE id = ?', [req.body.name , req.params.id], (err, results) => {
                                                        if (err) {
                                                            res.json(error(err.message))
                                                        } else {
                                                            
                                                            //res.json(success(results[0]))
                                                            res.json(success(true))
                                                        }
                                                    }) 
                                                }

                                            }

                                        })
                                    } else {
                                        res.json(error('id not exist'))
                                    }
                                    
                                }
                            })
                        } else {
                            res.json(error('no name value'))
                        }

                    })
                
                    .delete((req, res) => { //modif d'un élément
                        
                        db.query ('SELECt * FROM members WHERE id= ?', [req.params.id], (err, result) => {
                            if (err) {
                                res.json(error(err.message))
                            } else {
                                if (result[0] != undefined) {
                                    
                                    db.query('DELETE FROM members where id = ?', [req.params.id], (err, result) => {
                                        if (err) {
                                            res.json(error(err.message))
                                        } else {
                                            res.json(success(true))
                                        }
                                    })



                                } else {
                                    res.json(error('id not exist'))
                                }
                                
                            }
                        })

                        
                    })  
                
                MemberRouter.route('/')
                    
                    .get ((req,res) => {
                        if (req.query.max != undefined && req.query.max > 0) {
                            db.query ('SELECT * FROM members LIMIT 0, ?',[req.query.max], (err, results) => {
                                if (err) {
                                    res.json(error(err.message))
                                } else {
                                    res.json(success(results))
                                }
                            })
                
                        } else if  (req.query.max != undefined) { //valeur qui est donc négative ce qui n'est pas bon
                                res.json(error('Valeur de Max incorrecte'))
                        } else {
                            db.query ('SELECT * FROM members', (err, results) => {
                                if (err) {
                                    res.json(error(err.message))
                                } else {
                                    //console.log(results)
                                    res.json(success(results))
                                }
                            })
                        }
                    })
                
                    .post ((req,res) => {
                        if (req.body.name) {
                            
                            db.query ('SELECT * FROM members where name = ?',[req.body.name], (err, results) => {
                                if (err) {
                                    res.json(error(err.message))
                                } else {
                                    if (results[0] != undefined) {
                                        res.json(error('name aleady taken'))

                                    } else {
                                        console.log('one')
                                        db.query('INSERT INTO members (name) VALUES(?)', [req.body.name], (err, results) => {
                                            console.log('post insert')
                                            if (err) {
                                                res.json(error(err.message))
                                            } else {
                                                console.log('two')
                                                db.query ('SELECT * FROM members where name = ?',[req.body.name], (err, results) => {
                                                    if (err) {
                                                        res.json(error(err.message))
                                                    } else {
                                                        console.log('ok') 
                                                       // res.json(success(results))
                                                        res.json(success({
                                                            id : results[0].id,
                                                            name : results[0].name
                                                        }))
                                                    }

                                                })
                                            }
                                        })


                                    }
                                }
                            })
                            
                
                    } else {
                        res.json(error('no name value'))
                    }
                    })
                
                app.use(config.routeAPI+'members', MemberRouter) // laise la main à Membersrouter sur ce qui contient '/api/v1/members'
        
        
        
        /*
        db.query ('select * from members', (err, results) => {
        //db.query ('insert into members (name) values("Mika")', (err, results) => {
            if (err)
                console.log(err.message)
            else
                //console.log(results)
                console.log(results[100].name)
       
        })
        */
    }  
  });

  /*
const members = [
    {
        id : 1,
        name : 'John'
    },
    {
        id : 2,
        name : 'Lisa'
    },
    {
        id : 3,
        name : 'Nigel'
    },
    {
        id : 4,
        name : 'Fernand'
    },
    {
        id : 5,
        name : 'Seb'
    },
]
*/


app.listen (config.port, () => console.log ('Started new on port 8080.'))


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
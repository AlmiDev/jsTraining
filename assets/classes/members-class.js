const { NetworkContext } = require("twilio/lib/rest/supersim/v1/network")

let db, config

module.exports = (_db, _config) => {  //du coup dès l'appel du module la fonction est éxécutée avec les paramètres qui sont passés
    db = _db
    config = _config
    return Members
}

let Members = class {
    static getById (id) {
       
        /* en théoris, mais on pva éviter de gérer à chaque le erreur à ce niveau -> tout passe en resolve et on va gérer les erreurs ailleurs
        return new Promise((resolve, reject) => {

             db.query ('SELECT * FROM members WHERE id = ?', [id])
            .then((result) => {
                if (result[0] != undefined) {
                    resolve(result[0])
                } else {
                    reject(new Error('wrong ID'))
                }

            })
            .catch((err) => reject (err))

        })
        
        */
       
        return new Promise((next) => {

            db.query ('SELECT * FROM members WHERE id = ?', [id])
                .then((result) => {
                    if (result[0] != undefined) {
                        next(result[0])
                    } else {
                        next(new Error('wrong ID'))
                    }

                })
                .catch((err) => next (err))
        
         })
    }

    static getAll (max) {
        
        return new Promise((next) => { 
        
            if (max != undefined && max > 0) {
                db.query ('SELECT * FROM members LIMIT 0, ?',[parseInt(max)])
                    .then((result) => next(result))
                    .catch((err) => next(err))
            } else if  (max != undefined) { //valeur qui est donc négative ce qui n'est pas bon
                next(new Error('incorrect max value'))
            } else {
                db.query ('SELECT * FROM members')
                    .then((result) => next(result))
                    .catch((err) => next(err))
            }

        })


    }


    static add (name) {
        return new Promise((next) => {

            if (name && name.trim() != '') {
                        
                name=name.trim()
                db.query ('SELECT * FROM members where name = ?',[name])
                    .then((result) => {
                        
                        if (result[0] != undefined) {
                            next(new Error('name already taken')) 
                        } else {                           
                            console.log('one')
                            return db.query('INSERT INTO members (name) VALUES(?)', [name]) // on insère la valeur
                        }
                    })
                    .then (() => {
                        return db.query ('SELECT * FROM members where name = ?',[name]) // récupération de l'ID de la valeur insérée
                    })
                    .then ((result) => { // on affiche la valeur qui a été insérée avec l'id nouvellement ajouté
                        next ({
                            id : result[0].id,
                            name : result[0].name
                        })
                    })
                    .catch((err) => next(err))
            } else {
                next (new Error('no name value'))
            }      

        })

    }


    static update (id,name) {
        return new Promise((next) => {
            if (name && name.trim() != '') {
                name=name.trim()
                //on vérifie que l'ID existe 
                db.query('SELECT * FROM members WHERE id = ?', [id])
                    .then((result) => {
                        if (result[0] != undefined) {
                            //on update
                            return db.query('SELECT * FROM members WHERE name = ? AND id != ?', [name ,id]) 
                        } else {
                            next (new Error('id not exist'))
                        }
                    })
                    .then ((result)=> {
                        if (result[0] !=undefined) {
                            next (new Error('name already exist'))
                        } else {
                           return db.query('UPDATE members SET name = ? WHERE id = ?', [name ,id])
                           //next(true)
                        }
                    })
                   
                    .then(() => {
                        next(true)

                    })
                    .catch((err) => next(err))
                

            } else {
                next (new Error(config.errors.noNameValue))
            }


        })
    }

    static delete (id) {
        return new Promise((next) => {
            //console.log('init')
            db.query ('SELECt * FROM members WHERE id= ?', [id])
            
            .then ((result) => {
                if (result[0] != undefined) {
                    console.log('request delete')
                    return db.query('DELETE FROM members where id = ?', [id])
                } else {
                    next(new Error('id not exist'))
                }
            })
            .then (() => {
                console.log('on balance true')
                next(true)
            })
            .catch((err) => next(err))

        })
    }


    /*

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


*/



}

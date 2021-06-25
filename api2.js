const express = require('express')
const morgan = require('morgan')
//const funcValid = require('functionsAPI')
const {success, error} = require('functionsAPI') // cré un objet avec les 2 cvariables ce qui permet d'alléger le code en enlevant le nom de fonction à la base (funcValid)
const app = express()


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

app.use(morgan('dev'))
//pour récupération des données de post
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

app.get ('/api/v1/members/:id', (req,res) => {
    //res.send(members[req.params.id-1].name)
    // -> passage au format json res.send-> res.json
    //res.json(members[req.params.id-1].name)
    //gestion du success en cas de réussite pour renvoyer un statut
    //res.json(funcValid.success(members[req.params.id-1].name))
    //res.json(success(members[req.params.id-1].name)) // ne fonctionne que tant que l'on a un truc à la base, en cas de modif, ajout ou suppression ce n'es tplsu bon, on va donc chercher la valeur de l'index via getIndex

    let index= getIndex(req.params.id)
    if (typeof(index) == 'string') {
        res.json(error(index))
    } else {
        res.json(success(members[index]))
    }
})

app.get ('/api/v1/members', (req,res) => {
    if (req.query.max != undefined && req.query.max > 0) {
         res.json(success(members.slice(0,req.query.max)))
    } else if  (req.query.max != undefined) { //valeur qui est donc négative ce qui n'est pas bon
            res.json(error('Valeur de Max incorrecte'))
    } else {
        res.json(success(members))
    }
})

app.post ('/api/v1/members', (req,res) => {
    if (req.body.name) {
        let sameName = false

        for (let i=0; i < members.length; i++) {
            if (members[i].name == req.body.name) {
                console.log('find')
                sameName = true
                break
            }
        }
        
        if (sameName) {
            res.json(error('name already exists'))
           

        } else {
            let newMember = {
                id : createID(),
                name : req.body.name
            }
            members.push(newMember)
        
            res.json(success(newMember))
            
        }   

    } else {
        res.json(error('No name value'))
    }

}) 

app.put ('/api/v1/members/:id', (req, res) => {  //modification d'un élément
    
    let index = getIndex(req.params.id)
    
    if (typeof(index) == 'string') {
        res.json(error(index))
    }else {
        let sameName = false       
        for (let i=0; i < members.length; i++) {
            if (members[i].name == req.body.name && members[i].id != req.params.id) {
                console.log('find')
                sameName = true
                break
            }
        }
        if (sameName) {
            res.json(error('name already exists'))
        } else {
            
            members[index].name = req.body.name
            res.json(success(true))
        }
    }
})


app.delete('/api/v1/members/:id' , (req, res) => { //modif d'un élément
    let index = getIndex(req.params.id)
    
    if (typeof(index) == 'string') {
        res.json(error(index))
    } else {

        members.splice(index,1)
        res.json(success(members))
    }

})  

app.listen (8080, () => console.log ('Started new on port 8080.'))

function getIndex(id) {
    for (let i= 0; i < members.length; i++) {
        if (members[i].id == id) 
            return i
        
    } 
    return 'wrong id'
}


function createID() {
    return members[members.length-1].id + 1 
}

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
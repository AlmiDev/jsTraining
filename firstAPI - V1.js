//usage du framework express qui permet d emieux gérer les url
const express = require('express')
const morgan = require('morgan')
//const bodyParser = require('body-parser')
const funcAPI = require('functionsAPI')

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

//console.log (members[0])

//retour de l'entrée complète
/*
app.get ('/api/v1/members/:id', (req,res) => {
    res.send(members[req.params.id-1])
})
*/

app.use(morgan('dev'))
//middleware peit module lu au moment de la requête et qui s'execute à ce moment et avant de passer à la suite.

// cf doc express pour recuperation données en vue du parsing, paer rappoirt à la doc express remplace désormais body-parser
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


//retour d'un champ en particulier
app.get ('/api/v1/members/:id', (req,res) => {
    res.send(members[req.params.id-1].name)
    //pour passer en en tête un bon formattage on indique qu'il s'agit de JSON
    res.json(funcAPI.success(members[req.params.id-1].name))
})

//récupération de tous les membres
app.get ('/api/v1/members', (req,res) => {
    if (req.query.max != undefined && req.query.max > 0 ) {
        //res.send(members.slice(0, req.query.max))
        res.json(success(members.slice(0, req.query.max)))
    } else if (req.query.max != undefined) {
        res.json(funcAPI.error('Wrong max value'))
    } else
    //res.send(members)
    res.json(funcAPI.success(members))
})

//il faut le package body parser pour pouvoir parser le body => doc express

app.post('/api/v1/members', (req, res) => {
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
            res.json(funcAPI.error('name already exists'))
           

        } else {
            let newMember = {
                id : members.length+1,
                name : req.body.name
            }
            members.push(newMember)
        
            res.json(funcAPI.success(newMember))
            
        }   
        

    } else {
        res.json(funcAPI.error('no name value'))
        
    }
    
   // res.send(req.body)
})


/*
app.use ((req, res, next) => {
    console.log('URL :' + req.url)
    next ()
})
*/
/*
 1er exercice
app.get ('/api', (req,res) => {
    res.send('Root API')
})


app.get ('/api/V1', (req,res) => {
    res.send('API Version 1 - Welcome')
})


app.get ('/api/V1/books/:id/:param2', (req,res) => {
    res.send(req.params)
})

*/



app.listen (8080, () => console.log ('Started on port 8080.'))
/*
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
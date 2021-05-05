//usage du framework express qui permet d emieux gérer les url
//V2 finalisation de l'APi sans prise en compte du routeur

const express = require('express')
const morgan = require('morgan')
//const bodyParser = require('body-parser')
const {success, error} = require('functionsAPI')

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

//definition du router pour éviter de répéter continuellement l'url /api/v1/Members etc..
let MembersRouter = express.Router ()

app.use(morgan('dev'))
//middleware peit module lu au moment de la requête et qui s'execute à ce moment et avant de passer à la suite.

// cf doc express pour recuperation données en vue du parsing, paer rappoirt à la doc express remplace désormais body-parser
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded


//retour d'un champ en particulier
app.get ('/api/v1/members/:id', (req,res) => {
    
    let index = getIndex(req.params.id)
    
    if (typeof(index) == 'string') {
        res.json(error(index))
    }else {
      //res.send(members[getIndex(req.params.id)].name)
       //pour passer en en tête un bon formattage on indique qu'il s'agit de JSON
       //res.json(success(members[index].name))
       res.json(success(members[index]))

    }
    
 
})

//récupération de tous les membres
app.get ('/api/v1/members', (req,res) => {
    if (req.query.max != undefined && req.query.max > 0 ) {
        //res.send(members.slice(0, req.query.max))
        res.json(success(members.slice(0, req.query.max)))
    } else if (req.query.max != undefined) {
        res.json(error('Wrong max value'))
    } else
    //res.send(members)
    res.json(success(members))
})

//il faut le package body parser pour pouvoir parser le body => doc express

app.put ('/api/v1/members/:id', (req, res) => {  //modification d'un élément
    
    console.log('toté')
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
            res.json(error('name already exists'))
           

        } else {
            let newMember = {
                //id : members.length+1,
                id : createID(),
                name : req.body.name
            }
            members.push(newMember)
        
            res.json(success(newMember))
            
        }   
        

    } else {
        res.json(error('no name value'))
        
    }
    
   // res.send(req.body)
})


app.delete('/api/v1/members/:id')

app.use('/api/v1/members', MembersRouter)

app.listen (8080, () => console.log ('Started on port 8080.'))


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
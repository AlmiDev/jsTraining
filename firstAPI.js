//usage du framework express qui permet d emieux gérer les url
const express = require('express')
const morgan = require('morgan')

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
//retour d'un champ en particulier
app.get ('/api/v1/members/:id', (req,res) => {
    res.send(members[req.params.id-1].name)
})

//récupération de tous les membres
app.get ('/api/v1/members', (req,res) => {
    res.send(members)
})

app.use(morgan('dev'))

//middleware peit module lu au moment de la requête et qui s'execute à ce moment et avant de passer à la suite.

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
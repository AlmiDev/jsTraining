//const { homedir } = require('node:os');
const os = require('os');
const fs = require('fs');
const http = require('http');
//const { send } = require('node:process');
var toDisplay;

//module OS
//des infos sur le système d'exploitation 
//os se met dans une constante
console.log(os.arch())
console.log(os.homedir())
//console.log(os.cpus())


//module fs
fs.readFile('test.txt', 'utf-8',(err, data) => {
    if (err) {
        console.log(err)
    }
    else {
        console.log(data)
    }
})


fs.writeFile('test.txt', 'Hello world 2', 'utf-8', (err) =>{
    
    if (err) {
        console.log(err)
    }
    else {
        console.log('bien modifié')
        fs.readFile('test.txt', 'utf-8', (err,data) => {
            console.log(data)
        })
    }

} )

//module http
//creation d'un serveur local sur le port 8080
http.createServer( (req,res)=> {
    
    if (req.url == '/'){
        res.writeHead(200, {'Content-type' : 'text/html'})
        res.write("<h1>Hello</h1>\n")
        res.end
    } else if (req.url=='/texte') {
        res.writeHead(200, {'Content-type' : 'text/html'})        
        fs.readFile('test.txt', 'utf-8', (err,data) => {
            if (err) {
                send404(res)
            } else       
                res.write(data)
            })
        res.end 
    } else {
        send404(res)
        res.write (req.url)
        res.end
    }
    
    
    //res.write("<b>hello fantastic world</b>")
     //res.write(req.url)

}).listen(8080)


//function send404 (res, toDisplay) {
function send404 (res) {   
    res.writeHead(404, {'Content-type' : 'text/html'})
    res.write("<span style = 'color : red'>error</span>\n")
    //res.write("<span style = 'color : red'>"&toDisplay&"</span>\n")
    res.end
}


//combianaison module

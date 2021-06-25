//ajout d'un module fait en propre en mettant le répertoire de référence

//const mod1 = require ('./module1.js')


// pour n,e pas mettre d echemin on met tous les fichiers de module dans un fichier node_modules et c'est OK, et sans préciser le .js à la fin du coup
const mod1 = require ('./module1')

mod1.sayHello()
mod1.sayHi()
console.log(mod1.hello)
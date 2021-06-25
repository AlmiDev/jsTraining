/*
exports.sayHello = function () {
    console.log('Say Hello')
}

exports.sayHi =  () => {
    console.log('Say Hi')
}

exports.hello ='Hello World'

Plus propre car plus simple à miantenir en distinguant les fonctions et les exports 
*/

sayHello = function () {
    console.log('Say Hello')
}

sayHi =  () => {
    console.log('Say Hi')
}

hello ='Hello World'

exports.sayHello = sayHello;
exports.sayHi = sayHi;
exports.hello = hello;
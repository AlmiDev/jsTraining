//import 'babel-register'
var v1
const v3 = 4

if (true) { 
    v1 = 1
    let v2 = 2
    console.log(v2)

}

console.log(v1)
console.log(v3);



(function() {
    console.log('test')
}) ()

setTimeout(function(){
    console.log ('test 2')
}, 2000);

// en ES6
(() => {
    console.log('test 3')
})();

setTimeout (()=> {
    console.log ('test 4')
}, 1000

)

// marche même sans crochet
setTimeout (() => console.log('test 5') )
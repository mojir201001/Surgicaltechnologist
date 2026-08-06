const updateUserIdentity = require("./utils/updateUserIdentity");


let ctx = {

from:{
id:123456,
username:"test",
first_name:"Ali",
last_name:"Test"
}

};


updateUserIdentity(ctx,(id)=>{

console.log("USER ID:",id);

});
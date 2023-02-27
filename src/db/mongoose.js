const mongoose = require('mongoose')
mongoose.set('strictQuery',false)

mongoose.connect('mongodb://localhost:27017/task-manager-api', {
    // useNewUrlParse:true,
    // useCreateIndex:true
    // useFindAndModify:false
    
})

// const me=new User({
//     name:"Shyam",
//     age:67,
//     email:"vim22222@gmail.com",
//     password:"Vin@nnn1"
// })

// me.save().then(()=>
// {
//     console.log(me)
// }).catch((error)=>
// {
//     console.log(error)
// })



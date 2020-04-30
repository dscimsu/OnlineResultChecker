let mongoose  = require('mongoose');
let Schema = mongoose.Schema;
let bcrypt = require('bcryptjs');
//comments
let userSchema = new Schema({
    name:{type: String, required:true},
    email: {type: String, required:true},
    password:{type: String},
    matnumber:{type: String},
    school:{type: String },
    department:{type: String},
    image:{type: String}

});

userSchema.methods.encryptPassword = function(password){
    return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}
userSchema.methods.validPassword = function(password){
    return bcrypt.compareSync(password, this.password);
}
module.exports = mongoose.model('User', userSchema);  


module.exports = mongoose.model('User', userSchema);
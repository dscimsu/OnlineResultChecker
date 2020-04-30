var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//comments
var schema = new Schema({
    user: { type: Schema.Types.ObjectId, ref: "User"},
    semester:{type: String, required: true},
    level:{type: String, required: true},
    year:{type: String, required: true},
    gp:{type: Number, required: true},
    resultsData: {type: Object, required: true}
});
module.exports = mongoose.model('Result', schema);
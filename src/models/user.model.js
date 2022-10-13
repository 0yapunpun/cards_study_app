var mongoose =  require('mongoose');
var Schema = mongoose.Schema;

const userSchema = new Schema({
  user:  String, 
  password: String
},{
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);
  
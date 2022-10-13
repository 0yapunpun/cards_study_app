const controller = {};

const UserModel = require('../models/user.model')

controller.loginValidate = async(req, res, next) => {
  let {user, password} = req.body; 

  try {
    let response = await UserModel.find({user: user, password: password})

    if (response.length) {
      req.session.login = true;
      req.session.user = {id: response[0].id.toString()};

      return res.send({success: true, message: "succed validation"}) 
    } else {
      return res.send({success: false, message: "incorrect credentials"}) 
    }

  } catch (error) {
    console.log(error)
    return res.send({success: false, message: 'failed operation'}) 
  }
}

controller.loginTest = async(req, res, next) => {
  let {user, password} = req.body; 
  let newUser = new UserModel({user, password});

  try {
    await newUser.save()
    return res.send({success: true, message: 'succeeded operation'}) 
  } catch (error) {
    console.log(error)
    return res.send({success: false, message: 'failed operation'}) 
  }
}

module.exports = controller
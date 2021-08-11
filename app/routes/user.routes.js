module.exports = (app) => {
  const userCtrl = require('../controllers/user.controller')

  var router = require('express').Router()

  if (userCtrl.create) {
    router.post('/register', userCtrl.create)
  }
  if (userCtrl.login) {
    router.post('/login', userCtrl.login)
  }

  if (userCtrl.findOne) {
    router.get('/user/:token', userCtrl.findOne)
  }

  if (userCtrl.update) {
    router.put('/user/:token', userCtrl.update)
  }

  if (userCtrl.findAll) {
    router.get('/users/:token', userCtrl.findAll)
  }

  //if (userCtrl.delete) {
  router.delete('/user/:token', userCtrl.delete)
  //}

  app.use('/', router)
}

const usersCtrl = require('../controllers').users
const histsCtrl = require('../controllers').hists

module.exports = (app) => {
  
    // post
  // user
  app.post('/api/u/signup', usersCtrl.signup)
  app.post('/api/b/signup', usersCtrl.signupBank)
  app.post('/api/u/signin', usersCtrl.signin)
  app.post('/api/u/:userId', usersCtrl.deleteUser)
  app.post('/api/u/getData/:userId', usersCtrl.getUserData)
  app.post('/api/u/toUser/:userId', usersCtrl.userToUserTransaction)
  app.post('/api/b/toUser/:userId', usersCtrl.bankToUserTransaction)
  app.post('/api/b/toBank/:userId', usersCtrl.userToBankTransaction)

  // get
  // user
  app.get('/api/u/balance/:userId', usersCtrl.checkUserBalance)
  app.get('/api/u/debt', usersCtrl.displayUsersWithDebt)

  // history
  app.get('/api/h/transaction', histsCtrl.displayAllUsersTransactions)
  
};
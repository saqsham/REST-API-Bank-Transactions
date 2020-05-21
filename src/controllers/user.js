const User = require('../models/user')
const History = require('../models/history')

module.exports = {

    async signup(req, res) {
        await User
        .create(req.body.email, req.body.username, req.body.password, req.body.bankName)
        .then(user => res.status(200).send(user))
        .catch(error => res.status(400).send(error));
    },

    async signupBank (req, res) {
        await User
        .createBank(req.body.email, req.body.username, req.body.password)
        .then(user => res.status(200).send(user))
        .catch(error => res.status(400).send(error));
    },

    async signin (req, res) {
        await User
        .authenticate(req.body.username, req.body.password)
        .then(user => res.status(200).send(user))
        .catch(error => res.status(400).send(error));
    },

    async getUserData (req, res) {
        await User
        .getData(req.params.userId, req.body.fullname, req.body.phone)
        .then(user => res.status(200).send(user))
        .catch(error => res.status(400).send(error));
    },
 
    async deleteUser (req, res) {
        await User
        .delUser(req.params.userId)
        .then(() => res.status(200).send('ok deleted'))
        .catch(error => res.status(400).send(error));
    },

    async checkUserBalance (req, res) {
        await User
        .userBalance(req.params.userId)
        .then(user => res.status(200).send(user))
        .catch(error => res.status(400).send(error));
    },

    async userToUserTransaction (req, res) {
        let name = await User.getUsernameFromId(req.params.userId)
        await User
        .transaction(req.params.userId, req.body.username, req.body.amount)
        .then(async () => {
            await History
            .getTransaction(name, req.body.username, req.body.amount)
            .then(history => res.status(200).send(history))
            .catch(error => res.status(400).send(error));
        })
        .catch(error => res.status(400).send(error));
    },

    async bankToUserTransaction (req, res) {
        await User
        .takeLoanFromBank(req.params.userId, req.body.bankName, req.body.amount)
        .then(user => res.status(200).send(user))
        .catch(error => res.status(400).send(error));
    },

    async userToBankTransaction (req, res) {
        await User
        .payLoanToBank(req.params.userId, req.body.bankName, req.body.amount)
        .then(user => res.status(200).send(user))
        .catch(error => res.status(400).send(error));
    },

    async displayUsersWithDebt (req, res) {
        await User
        .usersDebt()
        .then(users => res.status(200).send(users))
        .catch(error => res.status(400).send(error));
    }

}
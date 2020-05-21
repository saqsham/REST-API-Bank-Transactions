const History = require('../models/history')

module.exports = {

    async displayAllUsersTransactions (req, res) {
        await History
        .displayAll()
        .then(history => res.status(200).send(history))
        .catch(error => res.status(400).send(error));
    }

}
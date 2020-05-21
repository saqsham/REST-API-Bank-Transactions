const mongoose = require('mongoose')

const Schema = mongoose.Schema

const HistorySchema = new Schema({
    usernameTo: {
        type: String,
        trim: true
    },
    usernameFrom: {
        type: String,
        trim: true
    },
    amount: {
        type: Number,
        min: 500
    },
    transactionDate: {
        type: Date,
        default: Date.now
    }
})

HistorySchema.statics.displayAll = async () => {
    const history = await History.find().sort([['transactionDate', -1]])

    if (!history) {
        throw new Error('No data found')
    }

    return history;
}

HistorySchema.statics.getTransaction = async (usernameFrom, usernameTo, amount) => {
    const history = new HistorySchema({usernameFrom: usernameFrom, usernameTo: usernameTo, amount: amount})
    await history.save()

    if (!history) {
        throw new Error('Unable to create user')
    }

    return history;
}

const History = mongoose.model('History', HistorySchema)
module.exports = History
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const emailCheck = require('../helpers/is-email-address')
const passwordCheck = require('../helpers/is-password-check')

const Schema = mongoose.Schema

const UserSchema = new Schema({
    username: {
        type: String,
        trim: true
    },
    fullname: {
        type: String,
        trim: true
    },
    email: {
        type: String,
        unique: true,
        trim: true,
        lowercase: true
    },
    phone: {
        type: Number,
        unique: true,
        min: 10
    },
    password: {
        type: String,
        trim: true
    },
    bankName: {
        type: String,
        trim: true
    },
    balance: {
        type: Number,
        min: 0,
        default: 100000
    },
    loanMoney: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    isBank: {
        type: Boolean,
        default: false
    }
})

// create user // signup
// same user can have account in multiple banks
UserSchema.statics.create = async (email, username, password, bankName) => {
    const user = new User({email: email, username: username, password: password, bankName: bankName})
    await user.save()

    if (!user) {
        throw new Error('Unable to create user')
    }

    return user;
}

// create bank
UserSchema.statics.createBank = async(email, username, password) => {
    const user = new User({email: email, username: username, password: password, isBank: true, bankName: username, amount: 10000000})
    await user.save()

    if (!user) {
        throw new Error('Unable to create user')
    }

    return user;
}

UserSchema.statics.checkData = function (email) {
   try {
        if (!emailCheck(email)) {
            throw new Error(`Wrong mail`)
        } else {
            return true;
        }
   } catch (error) {
       console.error(error)
   }
}

// creating function to authenticate input against database
UserSchema.statics.authenticate = async (username, password) => {
    const user = await User.findOne({
        username
    })
    if (!user) {
        throw new Error('Unable to login')
    }

    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch, password)
    if (!isMatch) {
        throw new Error('Unable to login')
    }
    return user;
}

UserSchema.statics.getData = async (userId, fullname, phone) => {
    const user = await User.findById(userId)
    if (!user) {
        throw new Error('no user found')
    } else {
        await user.update({phone: phone, fullname: fullname})
    }

    return user;
}

UserSchema.statics.delUser = async (userId) => {
    const user = await User.findByIdAndDelete(userId)
    if (!user) {
        throw new Error('no user found')
    }

    return user;
}

// UserSchema.statics.findById = async (_id) => {
//     // console.log(email,password)
//     const user = await User.findOne({
//         _id
//     })

//     if (!user) {
//         throw new Error('Unable to find User')
//     }
//     // console.log(user)
//     return user;
// }

UserSchema.statics.getUsernameFromId = async (_id) => {
    const user = await User.findOne({
        _id
    })

    if (!user) {
        throw new Error('Unable to find User')
    }
    return user.username;
}

UserSchema.statics.findByUsername = async (username) => {
    const user = await User.findOne({
        username: username
    })

    if (!user) {
        throw new Error('Unable to find User')
    }
    return user;
}

UserSchema.statics.userBalance = async (userId) => {
    const user = await User.findById(userId)

    if(!user) {
        throw new Error('Unable to find User')
    }

    return user.userBalance;
}

UserSchema.statics.transaction = async (userId, username, amount) => {
    const userFrom = await User.findById(userId)
    const userTo = await User.findByUsername(username)
    
    if (!userFrom || !userTo) {
        throw new Error('Unable to find User')
    } else if (userTo.balance - amount < 0) {
        throw new Error('Not enough balance in account')
    } else {
        userFrom.balance = userFrom.balance - amount
        userTo.balance = userTo.balance + amount
        await userFrom.save()
        await userTo.save()
    }

    return;
}

UserSchema.statics.takeLoanFromBank = async (userId, bankName, amount) => {
    const user = await User.findById(userId)
    const bank = await User.findByUsername(bankName)

    if (!user || !bank) {
        throw new Error('Unable to find User')
    } else if (user.loan > 0) {
        throw new Error('Pay the previous loan fiirst')
    } else if (user.bankName != bank.username) {
        throw new Error('User is not associated with this bank')
    } else {
        user.loan = amount
        bank.balance = bank.balance - amount
        await user.save()
        await bank.save()
    }

    return user;
}

UserSchema.statics.payLoanToBank = async (userId, bankName, amount) => {
    const user = await User.findById(userId)
    const bank = await User.findByUsername(bankName)

    if (!user || !bank) {
        throw new Error('Unable to find User')
    } else if (user.loan <= 0 || user.balance < amount) {
        throw new Error('Not allowed')
    } else if (user.bankName != bank.username) {
        throw new Error('User is not associated with this bank')
    } else {
        user.loan = user.loan - amount
        bank.balance = bank.balance + amount
        await user.save()
        await bank.save()
    }

    return user;
}

UserSchema.statics.usersDebt = async () => {
    const users = await User.find({})
    console.log(users)

    return users;

}

//hashing a password before saving it to the database
UserSchema.pre('save', async function (next) {
    const user = this;
    if (user.isModified('password')) {
        user.password = await bcrypt.hash(user.password, 10)
        next()
    }
})

const User = mongoose.model('User', UserSchema)
module.exports = User
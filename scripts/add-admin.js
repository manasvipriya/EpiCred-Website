const { getArgs } = require("../shared/utils")
const models = require("../models")
const bcrypt = require("bcrypt")
const { BCRYPT_SALT_ROUNDS } = require("../shared/constants")
const mongoose = require("mongoose")
const env = require("../env")

// node scripts/add-admin.js --name=name --email=email --role=role --password=password
const item = getArgs(process.argv)
;(async () => {
    await mongoose.connect(env.dbUri)
    await models.admins.create({
        name: item.name,
        email: item.email,
        password: bcrypt.hashSync(item.password, BCRYPT_SALT_ROUNDS),
        active: 1,
        role: +item.role,
    })
    process.exit()
})()

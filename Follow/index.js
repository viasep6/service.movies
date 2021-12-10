const auth = require('../service.shared/Repository/Firebase/auth')
const create = require('./create')


module.exports = async function (context, req) {

    await auth(req, context, create.followMovie)

}
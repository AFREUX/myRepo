const moment = require('moment');


function foramtMessage(username,text){
    return{
        username,
        text,
        time: moment().format('h:mm ')
    }
}

module.exports = foramtMessage;
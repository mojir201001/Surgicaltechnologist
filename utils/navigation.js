function adminBack(){

    return {
        text:"⬅️ بازگشت به پنل مدیریت",
        callback_data:"back"
    };

}



function userHome(){

    return {
        text:"🏠 صفحه اصلی",
        callback_data:"home"
    };

}



function back(callback){

    return {
        text:"⬅️ بازگشت",
        callback_data:callback
    };

}



module.exports = {
    adminBack,
    userHome,
    back
};
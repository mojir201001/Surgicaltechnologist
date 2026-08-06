function formatDateTime(dateString){

    if(!dateString){

        return {
            date:"نامشخص",
            time:"نامشخص"
        };

    }


    const d = new Date(dateString);


    const date = 
        d.getFullYear()
        + "/" +
        String(d.getMonth()+1).padStart(2,"0")
        + "/" +
        String(d.getDate()).padStart(2,"0");


    const time =
        String(d.getHours()).padStart(2,"0")
        + ":" +
        String(d.getMinutes()).padStart(2,"0")
        + ":" +
        String(d.getSeconds()).padStart(2,"0");


    return {
        date,
        time
    };

}


module.exports = {
    formatDateTime
};
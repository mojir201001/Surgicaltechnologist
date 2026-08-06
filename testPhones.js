const phones = require("./utils/userPhones");


phones.saveUserPhone(
    1,
    "09350000000",
    ()=>{

        console.log("phone saved");

        phones.getUserPhones(
            1,
            (data)=>{

                console.log(data);

            }
        );

    }
);
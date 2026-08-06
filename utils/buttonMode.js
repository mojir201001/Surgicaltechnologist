function getButtonMode(mode){

    switch(mode){

        case "folder":
            return "📂 پوشه";

        case "content":
            return "📖 نمایش مطلب";

        case "input":
            return "📥 دریافت مطلب";

        case "mixed":
            return "🔀 ترکیبی";

        case "link":
            return "🔗 لینک";

        default:
            return "❓ نامشخص";

    }

}

module.exports = {
    getButtonMode
};

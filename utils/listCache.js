const lists = {};


function saveList(id, data){

    lists[id] = data;

}



function getList(id){

    return lists[id];

}



function deleteList(id){

    delete lists[id];

}



module.exports = {

    saveList,
    getList,
    deleteList

};
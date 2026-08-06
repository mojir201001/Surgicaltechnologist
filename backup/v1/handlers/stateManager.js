const states = {};

function setState(userId, state, data){

    states[userId] = {

        state: state,
        data: data || {}

    };

}

function getState(userId){

    return states[userId];

}

function clearState(userId){

    delete states[userId];

}

module.exports = {

    setState,
    getState,
    clearState

};
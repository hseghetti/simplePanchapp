export const types = {
    ADD: 'ADD',
    REMOVE: 'REMOVE'
}

export const actionCreators = {
    add: (item) => {
        return {type: types.ADD, payload: item}
    },
    remove: (index) => {
        return {type: types.REMOVE, payload: index}
    }
}

const initialState = {
    panchos: [
        {
            panchado: 'Ivana',
            reason: 'Tarde',
            date: 'Wed Feb 07 2018 10:00:08 GMT-0300'
        },
        {
            panchado: 'Emma',
            reason: 'Pancho',
            date: 'Wed Feb 08 2018 10:00:08 GMT-0300'
        }
    ]
}

// Function to handle actions and update the state of the store.
// Notes:
// - The reducer must return a new state object. It must never modify
//   the state object. State objects should be treated as immutable.
// - We set \`state\` to our \`initialState\` by default. Redux will
//   call reducer() with no state on startup, and we are expected to
//   return the initial state of the app in this case.

export const reducer = (state = initialState, action) => {
    const {panchos} = state
    const {type, payload} = action

    switch (type) {
        case types.ADD: {
            return {
                ...state,
                panchos: [...panchos, payload] 
            }
        }
        case types.REMOVE: {
            return {
                ...state,
                panchos: panchos.filter((pancho, i) => i !== payload)
            }
        }
        default: {
            return state
        }
    }
    
    return state
}
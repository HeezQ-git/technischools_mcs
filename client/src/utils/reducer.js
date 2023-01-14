// reducer switching with action.type changing action,field
export const reducer = (state, action) => {
    switch (action.type) {
        case 'set':
            return {
                ...state,
                [action.field]: action.value
            }
        case 'add':
            return {
                ...state,
                [action.field]: [...state[action.field], action.value]
            }
        case 'remove':
            return {
                ...state,
                [action.field]: state[action.field].filter(item => item !== action.value)
            }
        default:
            return state
    }
}





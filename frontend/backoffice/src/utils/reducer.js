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
export const initialGroupsState = {
    groups: [],
    users: [],
    currentUsers: [],
    filteredUsers: [],
    openedListSection: true,
    openedAddSection: true,
}
export const initialCreateGroupState = {
    name: '',
    error: [],
    addedUsers: [],
    users: [],
    responseError: '',
}
export const initialManageUserState = {
    name: '',
    surname: '',
    email: '',
    phone_number: '',
    error: [],
    responseError: '',
    loading: false,
}
export const initialMessagesState = {
    groups: [],
    users: [],
    receiverGroups: [],
    title: '',
    content: '',
    type: 'email',
    errors: [],
}



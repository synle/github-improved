export default {
    refresh : (value) => ({
        type : 'REFRESH',
        value : value
    }),
    updateApiToken : (value) => ({
        type : 'UPDATE_API_TOKEN',
        value : value
    })
}

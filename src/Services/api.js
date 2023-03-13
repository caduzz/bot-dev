const { default: axios } = require("axios")

const BASE_API = 'http://localhost:6969'

module.exports = {
    checkin_add: async (tipo, userId) => {
        if(tipo === 'entry'){
            const {data} = await axios.post(`${BASE_API}/checkin/entry`, { userId })
            return data
        }else {
            const {data} = await axios.post(`${BASE_API}/checkin/exit`, { userId })
            return data
        }
    },
    user_add: async (id, name, email, password) => {
        const {data} = await axios.post(`${BASE_API}/register`, { id, name, email, password })
        return data
    },
    git_user: async (user) => {
        try {
            const {data} = await axios.get(`https://api.github.com/users/${user}`)
            return data
        } catch (error) {
            console.log(error)
        }
        
    }
}
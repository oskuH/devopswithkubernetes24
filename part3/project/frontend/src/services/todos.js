import axios from 'axios'
const baseUrl = '/todos'

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = async todo => {
    const response = await axios.post(baseUrl, todo)
    return response.data.newTodo
}

const axiosFunctions = { getAll, create }

export default axiosFunctions
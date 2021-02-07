import axios from 'axios'

const api = axios.create({
    baseURL: 'http://localhost:3000/api',
})

export const insertScore = payload => api.post(`/score`, payload)
export const getScores = () => api.get(`/scores`)
export const getStats = () => api.get(`/stats`)
export const updateStats = payload => api.put(`/stats`, payload)
export const deleteScore = id => api.delete(`/score/${id}`)
export const deleteAllScores = () => api.delete(`/scores`)

const apis = {
    insertScore,
    getScores,
    getStats,
    updateStats,
    deleteScore,
    deleteAllScores,
}

export default apis

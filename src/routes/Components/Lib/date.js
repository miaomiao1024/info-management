import moment from 'moment'

export function formatDate(timestamp) {
    if (!timestamp) return ''
    timestamp = +`${timestamp}000`
    const time = new Date(timestamp)
    return moment(time).format('YYYY/MM/DD HH:mm:ss')
}

// 毫秒转
export function formatDateFromMS(timestamp) {
    if (!timestamp) return ''
    const time = new Date(timestamp)
    return moment(time).format('YYYY/MM/DD HH:mm:ss')
}
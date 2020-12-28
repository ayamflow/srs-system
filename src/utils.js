export function dayFromTime(timestamp) {
    let now = new Date(Date.now())
    let date = new Date(timestamp)
    let diff = (timestamp - Date.now()) / 1000 / 60 / 60

    if (diff < 24) {
        if (now.getDate() == date.getDate()) return 0
        return 1
    }
    
    return date.getDay()
}

export function hourFromTime(timestamp) {
    return new Date(timestamp).getHours()
}

  export const getDateLastSeen = (lastSeenTime, currentTime) => {
    let hour, minute
    
    const date_1 = new Date(lastSeenTime)

    const year_1 = date_1.getFullYear()
    const month_1 = date_1.getMonth()
    const day_1 = date_1.getDate()
    const hour_1 = date_1.getHours()
    const minute_1 = date_1.getMinutes()
    const seconds_1 = date_1.getSeconds()

    const { 
      year: year_2, 
      month: month_2, 
      day: day_2, 
      hour: hour_2, 
      minute: minute_2, 
      seconds: seconds_2
    } = currentTime


    hour = hour_1 < 10 ? + '0' + hour_1 : hour_1
    minute = minute_1 < 10 ? '0' + minute_1 : minute_1


    const date = date_1?.toJSON()?.split('T')[0]?.split('-')?.reverse()?.join('.')
    const time = `${hour}:${minute}`

    let lastSeen = `last seen online ${date} ${time}`


    if(year_1 === year_2) {
      if(month_1 === month_2) {
        if(day_1 === day_2) {
          const hour_to_sec = (+hour_2 * 3600 + +minute_2 * 60 + +seconds_2) - (+hour_1 * 3600 + +minute_1 * 60 + +seconds_1)

          if(hour_to_sec < 3600) {
            const min_to_sec = +minute_2 * 60 + +seconds_2 - +minute_1 * 60 + +seconds_1

            if(min_to_sec < 60) {
              lastSeen = 'last seen online just now'
            }
            else if(min_to_sec >= 60 && min_to_sec < 120) {
              lastSeen = 'last seen online a minute ago'
            }
            else {
              const min = Math.floor(min_to_sec / 60)
              lastSeen = `last seen online ${min} minutes ago`
            }
          }
          else if (hour_to_sec >= 3600 && hour_to_sec < 7200) {
            lastSeen = 'last seen online an hour ago'
          }
          else {
            lastSeen = `last seen online today ${hour}:${minute}`
          }
        }
        else if (day_2 - day_1 === 1) {
          lastSeen = `last seen online yesterday ${hour}:${minute}`
        }
      }
    }

    return lastSeen
  }

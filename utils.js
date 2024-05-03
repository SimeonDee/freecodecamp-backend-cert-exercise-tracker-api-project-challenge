const user_logs = (found_user, from, to, limit) => {
    let check_from = false
    let check_to = false
    let check_limit = false

    if(from)  { check_from  = !isNaN(Date.parse(from)) }
    if(to)    { check_to    = !isNaN(Date.parse(to)) }
    if(limit) { check_limit = /^[0-9]+$/.test(limit) }
    
    let { _id, username } = found_user
    let exercises_Exist = found_user.exercises
    let count = parseInt(found_user.exercises.count)
    let exercises_format = exercises_Exist.map( (ex) => {
        return { 
            description : ex.description, 
            duration : parseInt(ex.duration), 
            date : ex.date 
        }
    });

    let exercises_date = []; 
    let exercises_fin  = [];
  
    //create exercises_format as date requirement
    if (check_from == false && check_to == false) { 
      exercises_date = exercises_format
    } else if (check_from == true && check_to == false) {
      exercises_date = exercises_format.filter((d) => { 
            return Date.parse(d.date) > Date.parse(from)
        })
    } else if (check_from == false && check_to == true) {
      exercises_date = exercises_format.filter((d) => { 
            return Date.parse(d.date) < Date.parse(to)
        })
    } else if (check_from == true && check_to == true) {
      exercises_date = exercises_format.filter((d) => {
        return (Date.parse(d.date) > Date.parse(from) && 
                Date.parse(d.date) < Date.parse(to))
      })
    }
  
    if (check_limit == true) { 
        exercises_fin = exercises_date.slice(0,limit) 
    } else if (check_limit == false) { 
        exercises_fin = exercises_date
    }
    
    
    user_data = { 
        _id : _id, 
        username : username, 
        count : exercises_fin.length, 
        log : exercises_fin 
    }

    return user_data;
  }


const process_post_user_exercise = (found_user, description, duration, date) => {
    let isValidDate = Date.parse(date);
    if(isNaN(isValidDate)) { date = new Date().toDateString() } 
    else { date = new Date(date).toDateString(); }

    //Update user log
    let username     = found_user.username
    let _id          = found_user._id
    
    // let count  = parseInt(found_user.count) + 1

    // let exercises_Exist    = found_user.exercises
    // let exercises_input    = { description, duration, date }
    // let exercises          = exercises_Exist.concat(exercises_input)
    // const user = { username, _id, count, log : exercises }

    return { _id, username, date, duration, description }
}

module.exports = {
    user_logs,
    process_post_user_exercise,
}
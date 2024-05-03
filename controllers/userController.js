const User = require('../models/User')
const Exercise = require('../models/Exercise')
// const { user_logs } = require('../utils')
const { process_post_user_exercise } = require('../utils')

const postUser = async (req, res) => {
    try{
        const {username} = req.body
        const user = await User.create({ username })
        if(user){
            res.status(201).json( {_id: user._id, username: user.username })
        } else {
            res.status(400).json({ success: false, message: 'problem saving user'})
        }
    } catch(err){
        res.status(500).json({ error: err.message })
    }
}

const getUsers = async (req, res)=>{
    try{
        const users = await User.find({})
        if(users){
            res.json(users)
        } else {
            res.status(404).json({ success: false, message: 'No user found'})
        }
    } catch(err){
        res.status(500).json({ error: err.message })
    }
}

const getExercises = async (req, res)=>{
    try{
        const exercises = await Exercise.find({})
        if(exercises){
            res.json(exercises)
        } else {
            res.status(404).json({ success: false, message: 'No user found'})
        }
    } catch(err){
        res.status(500).json({ error: err.message })
    }
}

const getUserExercises = async (req, res)=>{
    try{
        const {user_id} = req.params
        const user = await User.findById(user_id)
        if(user){
            const userExercises = await Exercise.find({ username: user.username })
                                                // .populate('user', 'username')
            if(userExercises) {
                return res.json(userExercises)
            }
        }
        res.status(404).json({ success: false, message: 'No user found'})

    } catch(err){
        res.status(500).json({ error: err.message })
    }
}

const postUserExercise = async (req, res) => {
    try{
        const { user_id } = req.params
        let {description, duration, date } = req.body

        if(!(description && duration)) { 
            throw new Error('description and duration fields missing in requrest body')
        }

        if(!date){
            date = new Date().toDateString()
        } else if(!Date.parse(date)) {
            throw new Error('invalid date supplied')
        } else {
            date = new Date(date).toDateString()
        }

        if(isNaN(duration)){ throw new Error('duration field must be a number') }

        duration = Number.parseInt(duration)
        const user = await User.findById(user_id)
        if(user){
            const exercise = await Exercise.create({ username: user.username, description, duration, date })
            if(exercise) {
                // adds the new exercise _id to user's exercises list and save update
                user.exercises.push(exercise._id)
                await user.save()

                const { description, duration, date } = exercise
                const results = process_post_user_exercise(user,description, duration, date)
                res.json(results)
                
                // res.json({
                //     _id: user._id,
                //     username: user.username,
                //     description: exercise.description,
                //     duration: exercise.duration,
                //     date: exercise.date
                // })


                // res.json(await Exercise.findById(exercise._id).populate('username'))
                
            } else {
                res.status(400).json({ message: 'problem saving exercise'})
            }

        } else{
            res.status(400).json({ message: 'invalid user id supplied'})
        }

    } catch(err){
        res.status(500).json({ error: err.message })
    }
}

const getUserExerciseLogs = async (req, res)=>{
    try{
        const {user_id} = req.params
        const { from, to, limit } = req?.query

        let foundUser = await User.findById(user_id)
            .populate('exercises', '-_id -username -__v')
            
        if(foundUser){
            // const userLogs = user_logs(foundUser, from, to, limit)
            // return res.json(userLogs)

            
            let filtered = foundUser.exercises
            let isValidDate = true;
            if(to){ isValidDate = Date.parse(to) }
            if(from){ isValidDate = isValidDate && Date.parse(from) }

            if(!isValidDate){ 
                res.status(404).json({ message: 'invalid date supplied'}) 
            }

            if(isValidDate && (to || from)){
                // Select exercises within date range specified
                filtered = filtered.filter((exercise, i, data) => {
                    let resultFrom = from ? Date.parse(exercise.date) >= Date.parse(from) : true
                    let resultTo = to ? Date.parse(exercise.date) <= Date.parse(to) : true

                    return resultFrom && resultTo
                })

            }

            if(limit){
                // Sort in descending order of date
                filtered = filtered.sort((ex1, ex2) => {
                    if(Date.parse(ex1.date) < Date.parse(ex2.date)) return 1
                    else if(Date.parse(ex1.date) === Date.parse(ex2.date)) return 0
                    else return -1
                })

                filtered = filtered.slice(0, Number.parseInt(limit))
            }
            
            const { _id, username } = foundUser
            const count = filtered.length

            return res.json({ _id, username, count, log: filtered })
            
        }

        res.status(404).json({ message: 'invalid user id supplied'})

    } catch(err){
        res.status(500).json({ error: err.message })
    }
}

module.exports = {
    postUser,
    getUsers, 
    postUserExercise,
    getUserExercises,
    getExercises,
    getUserExerciseLogs
}
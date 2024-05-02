const User = require('../models/User')
const Exercise = require('../models/Exercise')
const { user_logs } = require('../utils')

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

        if(!date){
            date = new Date().toDateString()
        } else {
            date = new Date(date).toDateString()
        }

        duration = Number.parseInt(duration)
        const user = await User.findById(user_id)
        if(user){
            const exercise = await Exercise.create({ username: user.username, description, duration, date })
            if(exercise) {
                // adds the new exercise _id to user's exercises list and save update
                user.exercises.push(exercise._id)
                await user.save()

                user['description'] = exercise.description
                user['duration'] = exercise.duration
                user['date'] = exercise.date

                res.json({
                    ...user._doc,
                    description: exercise.description,
                    duration: exercise.duration,
                    date: exercise.date
                })

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

        // const queryFilter = {}
        // if(from && to){
        //     queryFilter.exercises =  [{date: 
        //             {
        //                 $gte: new Date(from).toDateString(), 
        //                 $lte: new Date(to).toDateString() 
        //             }
        //         }]
        // } else if(from && !to){
        //     queryFilter.exercises = [{date: {$gte: new Date(from).toDateString()}}]
        // } else if(to && !from){
        //     queryFilter.exercises = [{date: {$lte: new Date(to).toDateString()}}]
        // }

        // if(limit){
        //     queryFilter.exercises["$limit"] = Number.parseInt(limit)
        // }

        // console.log(queryFilter)


        let foundUser = await User.findById(user_id)
            .populate('exercises', '-_id -username -__v')
        
            
        if(foundUser){
            const userLogs = user_logs(foundUser, from, to, limit)
            return res.json(userLogs)

            // let exercises = foundUser.exercises
            // let filtered = exercises
            // if(to || from){
            //     filtered = exercises.filter((exercise, i, data) => {
            //         let resultFrom = from ? new Date(exercise.date) >= new Date(new Date(from).toDateString()) : true
            //         let resultTo = to ? new Date(exercise.date) <= new Date(new Date(to).toDateString()) : true

            //         console.log(resultFrom)
            //         console.log(resultTo)

            //         return resultFrom && resultTo
            //     })

            // }
            
            // // *********************
            // // return res.json({ filtered })

            // if(limit){
            //     let filtered = filtered.sort((ex1, ex2) => {
            //         if(new Date(ex1.date) > new Date(ex2.date)) return 1
            //         else if(new Date(ex1.date) === new Date(ex2.date)) return 0
            //         else return -1
            //     })

            //     filtered = filtered.slice(0, limit-1)
            // }
            
            // const { _id, username } = foundUser
            // const count = filtered.length
            // return res.json({ _id, username, count, log: filtered })
            
        }

        res.status(404).json({ success: false, message: 'invalid user id supplied'})

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
const express = require('express')
const router = express.Router()
const {
    postUser, 
    getUsers, 
    postUserExercise,  
    getUserExercises,
    getUserExerciseLogs
} = require('../controllers/userController')


router.post('/', postUser)
router.get('/', getUsers)
router.post('/:user_id/exercises', postUserExercise)
router.get('/:user_id/exercises', getUserExercises)
router.get('/:user_id/logs', getUserExerciseLogs)

module.exports = router
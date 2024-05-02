const express = require('express')
const router = express.Router()
const {
    getExercises,
} = require('../controllers/userController')

router.get('/', getExercises)

module.exports = router
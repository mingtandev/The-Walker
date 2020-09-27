
const express = require('express')

const UsersController = require('./../controllers/users')

const router = express.Router()

// Signup new account
router.post('/signup', UsersController.signup)
// Email verify
router.get('/signup/confirmation/:verifyToken', UsersController.confirmation)
// Resend email verify
router.post('/signup/resend', UsersController.resend)
// User login
router.post('/login', UsersController.login)
// Change password
router.patch('/change', UsersController.change)
// Reset password
router.post('/reset', UsersController.reset)
// Query user information
router.get('/information', UsersController.information)
// Delete user
router.delete('/:userID', UsersController.delete)

module.exports = router
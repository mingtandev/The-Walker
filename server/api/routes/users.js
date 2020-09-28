
const express = require('express')

const UsersController = require('./../controllers/users')
const checkAuth = require('./../middleware/checkAuth')

const router = express.Router()

// Signup new account
router.post('/signup', UsersController.signup)
// Email verify
router.get('/signup/confirmation/:verifyToken', UsersController.confirmation)
// Resend email verify
router.post('/signup/resend', UsersController.resend)
// User login
router.post('/login', UsersController.login)
// User token refresh
router.post('/login/refresh', UsersController.refresh)
// Reset password
router.get('/reset/:verifyToken', UsersController.reset)
// Reset password
router.post('/reset', UsersController.reset)
// Change password
router.patch('/information/change', UsersController.change)
// Query user information
router.get('/information', checkAuth, UsersController.information)
// Delete user
router.delete('/:userID', UsersController.delete)

module.exports = router
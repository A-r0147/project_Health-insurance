import express from 'express'
import * as userCtrl from '../controllers/user.js'

const router = express.Router();

router.get('/doctors',userCtrl.getDoctors)
router.get('/',userCtrl.getUsers)
router.post('/login',userCtrl.login)
router.post('/',userCtrl.addUser)

export default router;
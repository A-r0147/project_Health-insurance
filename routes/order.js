import express from 'express';
import * as orderCtrl from '../controllers/order.js';
const router = express.Router();

router.get('/',orderCtrl.getOrders);
router.get('/:userId',orderCtrl.getOrdersByUserId);
router.post('/',orderCtrl.addOrder);
router.delete('/:id',orderCtrl.cancelOrder);
router.put('/:id',orderCtrl.updateOrderStatus);

export default router;
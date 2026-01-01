import express from 'express';
import * as prodCtrl from '../controllers/product.js';
const router = express.Router();

router.get('/pages',prodCtrl.getTotalPages)
router.get('/',prodCtrl.getProducts);
router.get('/:id',prodCtrl.getProductById);
router.post('/',prodCtrl.addProduct);
router.put('/:id',prodCtrl.updateProduct);
router.delete('/:id',prodCtrl.deleteProductById);

export default router;
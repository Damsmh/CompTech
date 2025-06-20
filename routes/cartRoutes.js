const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, cartController.getAllProducts);
router.post('/add/:id', authMiddleware, cartController.addProduct);
router.post('/remove/:id', authMiddleware, cartController.deleteProduct);
router.post('/update/:id', authMiddleware, cartController.updateProductQuantity);

module.exports = router;
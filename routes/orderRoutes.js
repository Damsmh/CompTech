const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, orderController.getAllOrders);
router.post('/add', authMiddleware, orderController.addOrder);

module.exports = router;
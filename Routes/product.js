const Product = require('../models/Product');
const express = require('express');

const router = express.Router();

const { 
    newProduct,
    getProducts,
    getSingleProductDetails, 
    updateProduct, 
    DeleteProduct, 
    createProductReview,
    getProductReview,
    deleteReview,

    upload,
    uploadImage,
    getProductImage,
    deleteProductImage  
} = require('../controllers/productController');
const { AuthMiddleware, AuthorizeRoles } = require('../middleware/AuthMiddleware');


router.post('/admin/product/new', AuthMiddleware, AuthorizeRoles('admin'), newProduct);


router.get('/products', AuthMiddleware, getProducts);
router.get('/product/:id', AuthMiddleware, getSingleProductDetails);

router.route('/admin/product/:id') 
    .put(AuthMiddleware, AuthorizeRoles('admin'), updateProduct)
    .delete(AuthMiddleware, AuthorizeRoles('admin'), DeleteProduct)

router.put('/reviews', AuthMiddleware, createProductReview);
router.get('/reviews', AuthMiddleware, getProductReview);
router.delete('/reviews', AuthMiddleware, deleteReview );


router.post('/admin/product/image/:id', AuthMiddleware, upload.array('image', 4), uploadImage)
router.get('/admin/product/image/:id/lingerie', getProductImage)
router.delete('/admin/product/image/:id',AuthMiddleware, deleteProductImage)

// router.route('admin/product/image/:id')
//         .post(AuthMiddleware, upload.single('first_image'), uploadImage)
//         .get(AuthMiddleware, getProductImage)
//         .delete(AuthMiddleware, deleteProductImage)
    
module.exports = router;
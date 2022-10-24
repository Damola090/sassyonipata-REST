const multer = require('multer');
const Product = require('../models/Product');
const ErrorHandler = require('../Util/errorHandler');
const APIFeatures = require('../Util/apiFeatures');


// 1. Create a New Product            -                 /api/v1/admin/product/new
// 2. Get all Products                -                 /api/v1/products  (example: ?keyword=apple)  sorting, filtering, etc
// 3. Get Single Product Details      -                 /api/v1/product/:id
// 4. Update a single Product         -                 /api/v1/admin/product/:id
// 5. Delete a Single Product         -                 /api/v1/admin/product/:id
// 6. Create a Review / Update an existing Review -     /api/v1/review
// 7. Get Product Review                          -     /api/v1/reviews
// 8. Delete Product Reviews                      -     /api/v1/reviews


// 1. Create a New Product            -                 /api/v1/admin/product/new
const newProduct = async (req, res, next) => {

    try {

        req.body.user = req.user.id;

        const product = await Product.create(req.body)

        res.status(201).send({
            success: true,
            product: product,
            message: 'A New product has been Created'
        })

    } catch (err) {

        console.log(err)

        res.status(400).send({
            success: false,
            message: 'Product Failed to be created'
        })
    }

}

// 2. Get all Products                -                 /api/v1/products 
const getProducts = async (req, res, next) => {

    try {

        const ProductsCount = await Product.countDocuments();

        const apiFeatures = new APIFeatures(Product.find(), req.query).search()

        const products = await apiFeatures.query

        console.log(products)


        res.status(200).send({
            success: true,
            data: products,
            ProductsCount: ProductsCount

        })


    } catch (err) {

        res.status(400).send({
            success: false,
            message: 'Products cannot be fetched '

        })
    }
}

// 3. Get Single Product Details      -                 /api/v1/product/:id
const getSingleProductDetails = async (req, res, next) => {

    try {
        const product = await Product.findById(req.params.id)

        if (!product) {
            return next((new ErrorHandler('Product cannot be found', 404)))
        }

        res.status(200).send({
            success: true,
            data: product

        })

    } catch (err) {

        res.status(404).send({
            success: false,
            ErrorMessage: 'Product not Found'
        })

    }

}

// 4. Update a single Product         -                 /api/v1/admin/product/:id
const updateProduct = async (req, res, next) => {

    let product = await Product.findById(req.params.id)

    if (!product) {
        next(new ErrorHandler('Product not Found', 404));
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false

    });

    res.status(200).send({
        success: true,
        data: product,

    })

}

// 5. Delete a Single Product         -                 /api/v1/admin/product/:id
const DeleteProduct = async (req, res, next) => {

    try {

        const product = await Product.findById(req.params.id);


        if (!product) {
            next(new ErrorHandler('Product failed to be deleted', 400))
        }

        await product.remove();

        res.status(200).send({
            success: true,
            message: 'Product has been deleted'

        })

    } catch (err) {

        res.status(400).send({
            success: false,
            message: 'The product has been deleted'
        })

    }


}

// 6. Create a Review / Update an existing Review -     /api/v1/review
const createProductReview = async (req, res, next) => {

    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user.id,
        name: req.user.name,
        rating: Number(rating),
        comment,

    }

    const product = await Product.findById(productId)

    //check if user has reviewed this product
    const isReviewed = product.reviews.find(r => r.user.toString() === req.user._id.toString())

    //If user already has a review For this product, we update the review
    if (isReviewed) {
        product.reviews.forEach(review => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })

        //else we push the new Review into the reviews Array 
        //and update the number of reviews.
    } else {
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length;

    }

    //Overall Rating of the product
    product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length

    await product.save({ validateBeforeSave: false });

    res.status(200).send({
        success: true,
        product

    })

}

// 7. Get Product Review                          -     /api/v1/reviews
const getProductReview = async (req, res, next) => {

    try {

        const product = await Product.findById(req.query.id)

        res.status(200).send({
            success: true,
            reviews: product.reviews
        })

    } catch (err) {

        res.status(404).send({
            success: false,
            reviews: 'No review was found'
        })

    }

}

// 8. Delete Product Reviews                      -     /api/v1/reviews
const deleteReview = async (req, res, next) => {

    try {

        const product = await Product.findById(req.query.productId)

        const reviews = product.reviews.filter((review) => review._id.toString() !== req.query.id)

        const numOfReviews = reviews.length;

        const ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / reviews.length

        await Product.findByIdAndUpdate(req.query.productId, {
            reviews,
            ratings,
            numOfReviews

        }, {
            new: true,
            runValidators: true,
            useFindAndModify: false
        })

        res.status(200).send({
            success: true,
            message: 'This Review has been Deleted'
        })


    } catch (err) {

        res.status(404).send({
            success: false,
            message: 'This Review was not found'
        })


    }


}

const upload = multer({
    limits: {
        fileSize: 1000000000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
            return cb(new Error('please Upload an Image'))
        }

        cb(undefined, true)

    }
})

//upload image 
const uploadImage = async (req, res, next) => {

    try {

        const product = await Product.findById(req.params.id)

        const imagesUploaded = {
            first_image : req.files[0].buffer,
            second_image : req.files[1].buffer,
            third_image : req.files[2].buffer,
            fourth_image : req.files[3].buffer
        }

        product.images.push(imagesUploaded)

        await product.save()

        res.status(200).send({
            success: true,
        })        

      
    } catch (err) {

        res.status(400).send({
            success: false,
            data: 'picture could not be uploaded'
        })

    }
}

// get Image 
const getProductImage = async (req, res, next) => {

    try {

        const product = await Product.findById(req.params.id)

        if (!product) {
            throw new Error('Product not found')
        }

        res.set('Content-Type', 'image/jpg')
        res.send(product.images[0].first_image)
    } catch (err) {

        res.status(404).send('Image not found')

    }


}

//deleteProductImage
const deleteProductImage = async (req, res, next) => {

    try {

        console.log(req.params.id)

        const product = await Product.findById(req.params.id)

        product.images = undefined

        await product.save()

        res.status(200).send({
            success: true,
            data: product

        })


    } catch (err) {

        res.status(404).send({
            success: false,
            message: 'Product image failed to be deleted'
        })

    }



}



module.exports = {
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
}
const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true, 'Please add product Name'],
        trim : true,
        maxLength : [100, 'Product Name cannot exceed 100 characters'],


    },
    price : {
        type : Number,
        required : [true, 'Please enter product Price'],
        maxLength : [5, 'Product Name cannot exceed 5 characters'],
        default : 0

    }, 
    description : {
        type : String,
        required : [true, 'Please add product description'],
    

    },
    ratings : {
        type : Number,
        default : 0

    },
    images : [

            {
                first_image: {
                    type: Buffer,
                    required: true

                },
                second_image : {
                    type: Buffer,
                    required: true

                },
                third_image : {
                    type: Buffer,
                    required: true

                },
                fourth_image : {
                    type: Buffer,
                    required: true

                },
               
            }
    ],
    category : {
        type : String,
        required : [true, 'Please select category for this product'],
        enum : {
            values : [
                'Electronics',
                'cameras',
                'Accessories',
                'Headphones',
                'food',
                'Books',
                'clothes/shoes',
                'Beauty/Health',
                'Outdoor',
                'Home'
            ],
            message : 'Please select correct category for product'
        }

    },
    seller : {
        type : String,
        required : [true, 'please enter product seller']
    },
    stock : {
        type : Number,
        required : [true, 'Please enter product stock'],
        maxLength : [5, 'product name cannot exceed 5 characters'],
        default : 0
    },
    numOfReviews : {
        type : Number,
        default : 0
    },
    reviews : [
        {
            user : {
                type: mongoose.Schema.ObjectId,
                ref: 'User',
                required : true
        
            },
            name : {
                type : String,
                required : true

            },
            rating : {
                type : Number,
                required : true
            },
            comment : {
                type : String,
                required : true
            }

        }
    
    ],
    user : {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required : true

    },
    createdAt : {
        type : Date,
        default : Date.now
    }
})


productSchema.methods.toJSON = function() {

    const product = this

    const productObject = product.toObject()

    delete productObject.images

    return productObject

}

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
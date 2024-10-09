import Store from "../models/store.model.js";
import Offers from "../models/offer.model.js";
import { where, Op } from "sequelize";
const discountController = async (req, res, next) => {
    // category - restaurant, bar, etc.
    // search - search query
    // type - discount, buy one get one, etc.
    // rating - rating of stores that present offer
    // distance - store distamce from the user
    // discount - % of discount
    // longitude and latitude of end user
    // any other which apply
    try {
        const { category, search, type, rating, distance, discount, longitude, latitude } = req.body;
        
        // Initial query for stores
        let storeQuery = {
            where: {
                status: 'active'
            },
            attributes: ['store_name', 'address', 'latitude', 'longitude', 'category', 'rating', 'opening_hours'],
            include: [{
                model: Offers,
                where: {},
                attributes: ['offer_id', 'offer_type', 'description', 'discount_percentage', 'minimum_purchase', 'maximum_discount', 'end_date', 'terms_conditions', 'featured']
            }]
        }

        // Checking for partcular category
        if (category) {
            storeQuery.where.category = category;
        }

        // Checking for particular offer type
        if (type) {
            storeQuery.include[0].where.offer_type = type;
        }

        // Checking for rating which is greater than or equal to
        if (rating) {
            storeQuery.where.rating = {[Op.gte]: parseFloat(rating)}
        }

        // Checking for discount which is greater than or equal to
        if (discount) {
            storeQuery.include[0].where.discount_percentage = {[Op.gte]: parseFloat(discount)}
        }

        // Checking for particular search by the user
        if (search) {
            storeQuery.where[Op.or]= [  
                {store_name: {[Op.like]: `%${search}%`}},
                {category: {[Op.like]: `%${search}%`}},
                {address: {[Op.like]: `%${search}%`}},
                { '$offers.offer_type$': { [Op.like]: `%${search}%` } },
                { '$offers.description$': { [Op.like]: `%${search}%` } },
                { '$offers.discount_percentage$': { [Op.like]: `%${search}%` } }
            ];
        }

        const stores = await Store.findAll(storeQuery);

        // Adding distance field in each store to show the store
        // const storesWithoffersAndDistance = stores.map(store => {  
        //     return {
        //         distance: '5km',
        //         ...store.get()
        //     }
        // })
        return res.status(200).json({success: true, message: stores});
        
    }
    catch (error) {
        return next(error);
    }
};

export default discountController;
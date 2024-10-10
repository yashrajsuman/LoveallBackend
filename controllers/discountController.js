import {Store} from "../models/association.js";
import {Offers} from "../models/association.js";
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
        const { category, search, type, rating, distance, discount, longitude, latitude, page = 1, limit = 10 } = req.body;
        
        // Calculating offset
        const offset = (page - 1) * limit; 

        // Initial query for stores
        let offerQuery = {
            where: {},
            attributes: ['offer_id', 'offer_type', 'description', 'discount_percentage', 'minimum_purchase', 'maximum_discount', 'end_date', 'terms_conditions', 'featured'],
            include: [{
                model: Store,
                where: {status: 'active'},
                attributes: ['store_name', 'address', 'latitude', 'longitude', 'category', 'rating', 'opening_hours'],
            }],
            limit,
            offset
        }

        // Checking for partcular category
        if (category) {
            offerQuery.include[0].where.category = category;
        }

        // Checking for particular offer type
        if (type) {
            offerQuery.where.offer_type = type;
        }

        // Checking for rating which is greater than or equal to
        if (rating) {
            offerQuery.include[0].where.rating = {[Op.gte]: parseFloat(rating)}
        }

        // Checking for discount which is greater than or equal to
        if (discount) {
            offerQuery.where.discount_percentage = {[Op.gte]: parseFloat(discount)}
        }

        // Checking for particular search by the user
        if (search) {
            offerQuery.where[Op.or]= [  
                {'$Store.store_name$': {[Op.like]: `%${search}%`}},
                {'$Store.category$': {[Op.like]: `%${search}%`}},
                {'$Store.address$': {[Op.like]: `%${search}%`}},
                { offer_type: { [Op.like]: `%${search}%` } },
                { description: { [Op.like]: `%${search}%` } },
                { discount_percentage: { [Op.like]: `%${search}%` } }
            ];
        }

        const {count, rows} = await Offers.findAndCountAll(offerQuery);

        // Adding distance field in each store to show the store
        // const storesWithoffersAndDistance = stores.map(store => {  
        //     return {
        //         distance: '5km',
        //         ...store.get()
        //     }
        // })

        // Calculating the number of pages
        const totalPages = Math.ceil(count / limit);
        return res.status(200).json({
            success: true,
            data: rows,
            pagination: {
                totalItems: count,
                totalPages: totalPages,
                currentPage: page,
                limit: limit
            }
        });
        
    }
    catch (error) {
        return next(error);
    }
};

export default discountController;
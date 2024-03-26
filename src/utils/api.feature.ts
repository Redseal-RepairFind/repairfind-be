import mongoose, { Model } from 'mongoose';

export class APIFeatures {

    public query;
    public queryString;

    constructor(query: any, queryString: any) {
        this.query = query;
        this.queryString = queryString;
    }

    filter() {
        const queryObj = {...this.queryString};
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        return this;
    }

    sort() {
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',');
            let sortOptions = '';
    
            sortBy.forEach((sortField: string) => {
                if (sortField.startsWith('-')) {
                    // Sort in descending order
                    const field = sortField.substring(1);
                    sortOptions += `-${field} `;
                } else {
                    // Sort in ascending order
                    sortOptions += `${sortField} `;
                }
            });
    
            this.query = this.query.sort(sortOptions.trim());
        } else {
            // Default sorting by createdAt field in descending order
            this.query = this.query.sort('-createdAt');
        }
    
        return this;
    }

    limitFields() {
        if (this.queryString.fields) {
            const fields = this.queryString.fields.split(',').join(' ');
            this.query = this.query.select(fields);
        }

        return this;
    }

    paginate() {
        const page = this.queryString.page * 1 || 1;
        const limit = this.queryString.limit * 1 || 20;
        const skip = (page - 1) * limit;

        this.query = this.query.skip(skip).limit(limit);

        return this;
    }

    async getTotalItems() {
        const totalItems = await this.query.model.countDocuments(this.query._conditions);
        return totalItems;
    }

    

    search() {

        if (this.queryString.search && this.queryString.searchFields) {

            let searchRegex: RegExp | null ;

            if (mongoose.Types.ObjectId.isValid(this.queryString.search)) {
                searchRegex = this.queryString.search; // Use ObjectId directly
            } else {
                searchRegex = new RegExp(this.queryString.search, 'i');
            }

            const searchFields = this.queryString.searchFields.split(',');

            console.log('searchRegex', searchRegex)
            const searchConditions = searchFields.map((field: any) => ({ [field]: searchRegex }));

            console.log('searchConditions', searchConditions)
            this.query = this.query.find({ $or: searchConditions });
        }

        return this;


    }



}



export const applyAPIFeature = async (model: any, query: any) => {
    try {
        const features = new APIFeatures(model, query);
        features.filter().search().sort().limitFields().paginate();
        const dataQuery = await features.query;
        const limit = features.queryString.limit;
        const currentPage = features.queryString.page;
        const totalItems = await features.getTotalItems();
        const lastPage = Math.ceil(totalItems / limit);
        const data =  {
            totalItems,
            limit,
            currentPage,
            lastPage,
            data: dataQuery,
        };
        return {data, error: null}
    } catch (error) {
        console.log(error)
        return {data: null, error: error}
    }
};
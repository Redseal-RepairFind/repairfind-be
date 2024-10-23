import mongoose from 'mongoose';

export class APIFeatures {

    public query;
    public queryString;
    public filters;

    constructor(query: any, queryString: any) {
        this.query = query;
        this.queryString = queryString;
        this.filters = {};
    }

    filter() {
        const queryObj = { ...this.queryString };
        const excludedFields = ['page', 'sort', 'limit', 'fields', 'startDate', 'endDate', 'search', 'searchFields'];
        excludedFields.forEach(el => delete queryObj[el]);

        // 1B) Advanced filtering
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        this.query = this.query.find(JSON.parse(queryStr));

        // Filtering by date range
        if (this.queryString.startDate) {
            const dateFilter: any = {}

            if (this.queryString.startDate) {
                const startDate = new Date(this.queryString.startDate);
                startDate.setUTCHours(0, 0, 0, 0);
                dateFilter.$gte = startDate
            }
            if (this.queryString.endDate) {
                const endDate = new Date(this.queryString.endDate);
                endDate.setUTCHours(23, 59, 59, 999);
                dateFilter.$lte = endDate
            }

            // If no end date is provided, set it to the end of the day
            if (!this.queryString.endDate) {
                const endDate = new Date(this.queryString.startDate);
                endDate.setUTCHours(23, 59, 59, 999);
                dateFilter.$lte = endDate
            }

            this.query = this.query.find({ createdAt: dateFilter });

            // Pass the date filter to the filters object
            this.filters = { ...JSON.parse(queryStr), createdAt: dateFilter }
        }

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

            let searchRegex: RegExp | null;

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



export const applyAPIFeature = async (model: any, query: any, methods?: any) => {
    try {
        const features = new APIFeatures(model, query);
        const queryMethods = methods ?? []
        features.filter().search().sort().limitFields().paginate();
        const dataQuery = await features.query;



       // Handle async victuals and methods
       if (dataQuery && dataQuery.length > 0) {
        await Promise.all(
            dataQuery.map(async (doc: any) => {
                const methods = Object.keys(doc.schema.methods);
                await Promise.all(
                    methods.map(async (method) => {
                        if (typeof doc[method] === 'function' && queryMethods.includes(method)) {
                            const result = await doc[method]();
                            const methodName = method.charAt(3).toLowerCase() + method.slice(4);
                            doc[methodName] = result; // Assign the resolved result to the document
                        }
                    })
                );
            })
        );
    }

        const limit = features.queryString.limit;
        const currentPage = features.queryString.page;
        const totalItems = await features.getTotalItems();
        const lastPage = Math.ceil(totalItems / limit);
        const data = {
            totalItems,
            limit,
            currentPage,
            lastPage,
            data: dataQuery,
        };
        return { data, error: null, filter: features.filters }
    } catch (error) {
        console.log(error)
        return { data: null, error: error }
    }
};
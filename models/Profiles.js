import mongoose from "mongoose";


const Schema = mongoose.Schema;

const profileSchema = new Schema(
    {
        name: {type: String, required: true},
        description: {type: String, required: true},
        image: {type: String, required: true},
        headline: {type: String, required: true},
        work: {type: String, required: true},
        email: {type: String, required: true},
        website: {type: String, required: true},
        phone: {type: Number, required: true},
        address: {type: String, required: true},
        habilities: []
    },
    {
        timestamps: true
    }
);

const Profile = mongoose.model('Profile', profileSchema);

export { Profile }
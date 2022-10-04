import mongoose from "mongoose";


const Schema = mongoose.Schema;

const profileSchema = new Schema(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        image: { type: String, required: true },
        headline: { type: String, required: true },
        email: { type: String, required: true },
        habilities: { type: Array, required: false },
        projects: [{ type: mongoose.Types.ObjectId, ref: 'Project', required: false }]
    },
    {
        timestamps: true
    }
);

const Profile = mongoose.model('Profile', profileSchema);

export { Profile }
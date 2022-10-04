import mongoose from "mongoose";


const Schema = mongoose.Schema;

const projectSchema = new Schema(
    {
        projectName: {type: String, required: true},
        imageLink: {type: String, required: true},
        livedemo: {type: String, required: true},
        email: {type: String, required: true},
        github: {type: String, required: true}
    },
    {
        timestamps: true
    }
);

const Project = mongoose.model('Project', projectSchema);

export { Project }
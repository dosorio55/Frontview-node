import express from "express";
import { isAuth } from "../authentication/jwt.js";
import { Profile } from "../models/Profiles.js";
import { Project } from "../models/Project.js";

const projectRoutes = express.Router();

//get project by email
projectRoutes.get('/personal', [isAuth], async (req, res, next) => {

    const { email } = req.authority

    try {
        const user = await Project.find({ email: email })
        return res.status(200).json(user)

    } catch (error) {
        return next(error)
    }
});

//get all projects
projectRoutes.get('/', [isAuth], async (req, res, next) => {


    try {
        const user = await Project.find()
        return res.status(200).json(user)

    } catch (error) {
        return next(error)

    }


});

//post project
projectRoutes.post('/', [isAuth], async (req, res, next) => {

    const { projectName, imageLink, description, github, livedemo } = req.body;
    //sacar el email
    const { email } = req.authority

    try {

        const newProject = new Project({ email, projectName, imageLink, description, github, livedemo });
        const userProfile = await Profile.findOne({ email });

        console.log(newProject, userProfile);

        await Profile.updateOne(
            { _id: userProfile._id },
            { $push: { projects: newProject } },
            { new: true }
        );
        await newProject.save()

        return res.json({
            status: 201,
            message: 'Registered successfully',
            data: newProject
        });

    } catch (error) {
        return next(error)
    }
});

//delete project

projectRoutes.delete('/:id', async (req, res, next) => {
    try {
        const { id } = req.params;

        const deletedProject = await Project.findByIdAndDelete(id);
        return res.status(200).json(deletedProject)

    } catch (error) {
        return next(error)
    }
});

export { projectRoutes }

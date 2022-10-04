import express from "express";
import { isAuth } from "../authentication/jwt.js";
import { upload, uploadToCloudinary } from "../middlewares/file.middleware.js";
import { Profile } from "../models/Profiles.js";

const profileRoutes = express.Router()

//get single profile
profileRoutes.get('/personal', [isAuth], async (req, res, next) => {

    const { email } = req.authority

    try {
        const personalProfile = await Profile.find({ email }).populate("projects")
        return res.status(200).json(personalProfile);
    } catch (error) {
        return next(error)
    }
});

//get profile by id

profileRoutes.get('/:id', async (req, res) => {

    const profileId = req.params.id

    try {

        const personalProfile = await Profile.findById(profileId)
        return res.status(200).json(personalProfile)

    } catch (error) {
        return next(error)
    }
})

//get all profiles
profileRoutes.get('/', async (req, res) => {
    try {
        const allUsers = await Profile.find()
        return res.status(200).json(allUsers)
    } catch (error) {
        return next(error)
    }
});

/* EDIT A PROFILE */

profileRoutes.put('/edit', [isAuth], async (req, res, next) => {

    const bodyData = req.body;

    const userEmail = req.authority.email;

    try {
        const user = await Profile.findOne({ email: userEmail });
        const userModify = new Profile(bodyData);
        console.log(userModify, user._id);

        //Para evitar que se modifique el id de mongo
        userModify._id = user._id;
        userModify.habilities = user.habilities;
        userModify.projects = user.projects;

        //buscamos por el id y le pasamos los campos a modificar
        await Profile.findByIdAndUpdate(user._id, userModify);

        //retornamos respuesta de  los datos del objeto creado 
        return res.json({
            status: 200,
            data: userModify,
        });
    } catch (error) {
        return next(error);
    }
});

/* ADD SKILLS */
profileRoutes.put('/add-skill', [isAuth], async (req, res, next) => {

    const { newSkills } = req.body;

    const userEmail = req.authority.email;

    try {
        const user = await Profile.findOne({ email: userEmail });

        let updatedSkills;

        if (user.habilities) {
            updatedSkills = [...user.habilities, newSkills.toLowerCase()]
        } else {
            updatedSkills = newSkills.toLowerCase()
        }

        await Profile.findByIdAndUpdate(user._id, { habilities: updatedSkills });

        return res.json({
            status: 200,
            data: updatedSkills,
        });
    } catch (error) {
        return next(error);
    }
});

/* UPLOAD IMAGE */
profileRoutes.put('/add-skill', [isAuth, upload.single('image'), uploadToCloudinary], async (req, res, next) => {

    const userPhoto = req.file_url;// me traigo la url de la foto

    const userEmail = req.authority.email;

    try {

        return res.json({
            status: 200,
            data: updatedSkills,
        });
    } catch (error) {
        return next(error);
    }
});

//post a profile

/* profileRoutes.post('/create', async (req, res, next) => {
    try {

        const newProfile = new Profile({
            name: req.body.name,
            description: req.body.description,
            image: req.body.image,
            headline: req.body.headline,
            work: req.body.work,
            email: req.body.email,
        });

        const createdProfile = await newProfile.save();
        return res.status(201).json(createdProfile);

    } catch (error) {
        next(error);
    }
}); */


export { profileRoutes }
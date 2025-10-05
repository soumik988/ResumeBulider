import Resume from "../models/resumeModel.js";
import fs from "fs";
import path from "path";

// CREATE RESUME
export const createResume = async (req, res) => {
    try {
        const { title } = req.body;

        //DEFAULT TEMPLATE
        const defaultResumeData = {
            profileInfo: {
                profilePreviewUrl: '',
                fullname: '',
                designation: '',
                summary: '',
            },
            contactInfo: {
                email: '',
                phone: '',
                location: '',
                linkedin: '',
                github: '',
                website: '',
            },
            workExperience: [
                {
                    company: '',
                    role: '',
                    startDate: '',
                    endDate: '',
                    description: '',
                },
            ],
            education: [
                {
                    degree: '',
                    institution: '',
                    startDate: '',
                    endDate: '',
                },
            ],
            skill: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            projects: [
                {
                    title: '',
                    description: '',
                    github: '',
                    liveDemo: '',
                },
            ],
            certification: [
                {
                    title: '',
                    issuer: '',
                    year: '',
                },
            ],
            language: [
                {
                    name: '',
                    progress: 0,
                },
            ],
            interests: [''],
        };

        const newResume = await Resume.create({
            userId: req.user._id,
            title,
            ...defaultResumeData,
            ...req.body
        });

        res.status(201).json(newResume);
    }
    catch (error) {
        res.status(500).json({ message: "failed to create resume", error: error.message });
    }
}

// GET ALL RESUMES OF USER
export const getUserResumes = async (req, res) => {
    try {
        const resumes = await Resume.find({ userId: req.user._id }).sort({ updatedAt: -1 });
        res.json(resumes);
    }
    catch (error) {
        res.status(500).json({ message: "failed to get resumes", error: error.message });
    }
}

// GET RESUME BY ID
export const getResumeById = async (req, res) => {
    try {
        const resume = await Resume.findOne({ _id: req.params.id, userId: req.user._id });
        if (!resume) {
            return res.status(404).json({ message: "Resume not found" });
        }
        res.json(resume);
    }
    catch (error) {
        res.status(500).json({ message: "failed to get resume", error: error.message });
    }
}

// UPDATE RESUME
export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!resume) {
            return res.status(404).json({ message: "Resume not Found or Not Authorised" });
        }
        // MERGE UPDATED RESUME
        Object.assign(resume, req.body);
        // SAVE UPDATED RESUME
        const savedResume = await resume.save();
        res.json(savedResume);
    }
    catch (error) {
        res.status(500).json({ message: "failed to update resume", error: error.message });
    }
}

// DELETE RESUME
export const deleteResume = async (req, res) => {
    try {
        const resume = await Resume.findOne({
            _id: req.params.id,
            userId: req.user._id
        });
        if (!resume) {
            return res.status(404).json({ message: "Resume not Found or Not Authorised" });
        }

        const uploadsFolder = path.join(process.cwd(), 'uploads');

        // DELETE THUMBNAIL
        if (resume.thumbnailLink) {
            const oldThumbnail = path.join(uploadsFolder, path.basename(resume.thumbnailLink));
            if (fs.existsSync(oldThumbnail)) {
                fs.unlinkSync(oldThumbnail);
            }
        }

        // DELETE PROFILE IMAGE
        if (resume.profileInfo?.profilePreviewUrl) {
            const oldProfile = path.join(
                uploadsFolder,
                path.basename(resume.profileInfo.profilePreviewUrl)
            );
            if (fs.existsSync(oldProfile)) {
                fs.unlinkSync(oldProfile);
            }
        }

        // DELETE RESUME DOCUMENT
        await Resume.findOneAndDelete({
            _id: req.params.id,
            userId: req.user._id
        });

        res.json({ message: "Resume deleted successfully" });

    } catch (error) {
        res.status(500).json({ message: "failed to delete resume", error: error.message });
    }
}

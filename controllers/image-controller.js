const Image = require('../models/images.js')
const uploadToCloudinary = require('../helpers/cloudinaryHelpers.js')
const fs = require('fs')
const cloudinary = require('../config/cloudinary.js')

const uploadImage = async (req, res) => {

    try {

        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "No image was uploaded."
            })
        }

        const { url, publicId } = await uploadToCloudinary(req.file.path)

        const newUploadedImage = new Image({
            url,
            publicId,
            uploadedBy: req.userInfo.userId
        })

        await newUploadedImage.save()

        // delete the file from local storage
        // fs.unlinkSync(req.file.path)

        res.status(201).json({
            success: true,
            message: "Image uploaded successfully",
            data: newUploadedImage
        })



    } catch (error) {
        console.log(error.message)
        res.status(500).json({
            success: false,
            message: `Internal server error`
        })
    }

}

const fetchImage = async (req, res) => {
    try {

        const page = parseInt(req.query.page) || 1
        const limit = parseInt(req.query.limit) || 5

        const skip = (page - 1) * limit

        const sortBy = req.query.sortBy || 'createdAt'
        const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1

        const totalImages = await Image.countDocuments()

        const totalPages = Math.ceil(totalImages / limit)

        const sortObj = {};

        sortObj[sortBy] = sortOrder

        const images = await Image.find({}).sort(sortObj).skip(skip).limit(limit)

        if (images) {
            return res.status(200).json({
                success: true,
                message: "Images fetched successfully",
                currentPage: page,
                totalPages: totalPages,
                totalImages: totalImages,
                data: images
            })
        }



    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: `Internal server error`
        })
    }
}

const deleteImage = async (req, res) => {

    try {

        const getCurrentIdOfImageToBeDeleted = req.params.id
        const userId = req.userInfo.userId

        const image = await Image.findById(getCurrentIdOfImageToBeDeleted)

        if (!image) {
            return res.status(404).json({
                success: false,
                message: "Image not found"
            })
        }

        // check if this image is uploaded by current admin who is trying to delete this image
        if (image.uploadedBy.toString() !== userId) {
            return res.status(403).json({
                success: false,
                message: `You are not authorized to delete this image because you haven't uploaded it`
            })
        }

        // delete this image first from cloudinary storage
        await cloudinary.uploader.destroy(image.publicId)

        // delete this image from mongodb
        await Image.findByIdAndDelete(getCurrentIdOfImageToBeDeleted)

        res.status(200).json({
            success: true,
            message: "Image deleted successfully"
        })



    } catch (error) {
        console.log(error.message);
        res.status(500).json({
            success: false,
            message: `Internal server error`
        })
    }

}

module.exports = { uploadImage, fetchImage, deleteImage }
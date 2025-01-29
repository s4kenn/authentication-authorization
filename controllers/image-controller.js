const Image = require('../models/images.js')
const uploadToCloudinary = require('../helpers/cloudinaryHelpers.js')

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

module.exports = uploadImage
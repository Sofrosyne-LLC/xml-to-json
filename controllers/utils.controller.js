// Dependencies
const convert = require("xml-js");
const parseString = require("xml2js").parseString;

// Middlewares

module.exports = {
    //   Test API connection
    getPingController: (req, res) => {
        try {
            return res.status(200).send({
                success: true,
                message: "Pong",
            });
        } catch (err) {
            return res.status(500).send({
                success: false,
                message: err.message,
            });
        }
    },

    //   Register
    postConvertFileController: async(req, res, next) => {
        try {
            const newFile = req.file;
            console.log(
                "🚀 ~ file: utils.controller.js:27 ~ postConvertFileController:async ~ newFile",
                newFile
            );
            let data;

            if (!newFile) {
                return res.status(400).send({
                    success: false,
                    message: "no file was selected",
                });
            }

            if (newFile.mimetype !== "application/xml") {
                return res.status(400).send({
                    success: false,
                    message: "please select an xml file",
                });
            }

            // try {
            //     parseString(newFile, function(err, result) {
            //         data = JSON.stringify(result);
            //         console.log(
            //             "🚀 ~ file: utils.controller.js:45 ~ parseString ~ data",
            //             data
            //         );
            //     });
            // } catch (error) {
            //     console.log("🚀 ~ file: utils.controller.js:46 ~ postConvertFileController:async ~ error", error)

            // }

            // var xml = require("fs").readFileSync(newFile.buffer, {
            //     encoding: "utf8",
            //     flag: "r",
            // });

            const convertedFile = convert.xml2json(newFile.buffer, {
                compact: true,
                // spaces: 4,
            });

            return res.status(200).send({
                success: true,
                data: {
                    // OriginalFile: newFile.originalname,
                    // data: data,
                    convertedFile: convertedFile,
                },
                message: `New file converted successfully`,
            });
        } catch (err) {
            console.log("postRegisterController: ~ err", err);
            return res.status(500).send({
                success: false,
                message: err.message,
            });
        }
    },

    // Login
    postLoginController: async(req, res, next) => {
        try {
            const { email, password } = req.body;

            // Run Hapi/Joi validation
            // const { error } = await loginValidation.validateAsync(req.body);
            // if (error) return res.status(400).send(error.details[0].message);

            //   check if user exist as admin
            const admin = await Admin.findOne({ email: email });

            // if user not found under admin, check caregivers
            if (!admin) {
                // check if user exist as caregiver
                const caregiver = await Caregiver.findOne({ email: email });
                if (!caregiver) {
                    return res.status(400).send("Invalid email or password");
                }

                // If user exists as caregiver...validate password and continue
                const validatePassword = await bcrypt.compare(
                    password,
                    caregiver.password
                );

                if (!validatePassword)
                    return res.status(400).send("Invalid email or password");

                //   Generate JWT Token
                const token = jwt.sign({ _id: caregiver._id }, process.env.JWT_SECRET);

                return res.status(200).send({
                    success: true,
                    data: {
                        user: caregiver,
                        token: token,
                    },
                    message: "Login successful",
                });
            }

            // validate password
            const validatePassword = await bcrypt.compare(password, admin.password);
            if (!validatePassword)
                return res.status(400).send("Invalid email or password");

            //   Generate JWT Token
            const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);

            return res.status(200).send({
                success: true,
                data: {
                    user: admin,
                    token: token,
                },
                message: "Login successful",
            });
        } catch (err) {
            return res.status(500).send({
                success: false,
                message: err.message,
            });
        }
    },
};
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const projectRoute = require('./ProjectRoute/projectRoute');
const mongoose  = require('mongoose');
const userRoute = require('./ProjectRoute/userRoute')
const multer = require('multer');
const { photosController, updateController } = require('./controllers/projectControllers');
const { v4: uuidv4 } = require('uuid');
const { profileController } = require('./controllers/userController');



// express app
const app = express();
// middlewares
app.use(express.json())
app.use(cors())
app.use(express.urlencoded({extended: false}))

// all route
app.use('/api/projects', projectRoute)
app.use('/api/user', userRoute)
app.use("/photos", express.static('uploads'))
 

// start multer
let uid = uuidv4()
const storage = multer.diskStorage({
    destination: function(req, file, cb){
        return cb(null, "./uploads")
    },
    filename: function (req, file, cb){
        return cb(null, `${uid},${file.originalname}`)
    }
})

const upload = multer({storage})

app.post('/upload', upload.single('file'), photosController)
app.post('/upload/profile', upload.single('file'), profileController)
app.post('/update/banner', upload.single('file'), updateController)
// end multer


const port = process.env.PORT || 5000;
const uri = process.env.MONGODB_URI;

mongoose.connect(uri)
    .then(() => {
        app.listen(port, () => {
            console.log(`Connected mongodb with server listening on port ${port}`)
        })
    })
    .catch((err)=> console.log(err))


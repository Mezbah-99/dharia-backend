const express = require('express');
const jwt = require('jsonwebtoken')
const { getAllProjects, getSingleProject, postNewProject, deleteProject, patchProject, photosController } = require('../controllers/projectControllers');
const requireAuth = require('../middlewares/requireAuth');
const router = express.Router();


router.use(requireAuth)



router.get('/', getAllProjects)
router.get('/:id', getSingleProject)
router.post('/', postNewProject)
router.delete('/:id', deleteProject)
router.patch('/:id', patchProject)



module.exports = router
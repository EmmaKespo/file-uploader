//Map Out Endpoint Routes
//to hook your URLs to your controller functions.

const express = require('express');
const router = express.Router();
const driveController = require('../controllers/driveController');
const { isAuthenticated } = require('../config/passport');
const upload = require('../config/multer');

// Secure individual path lines with the isAuthenticated middleware check
router.get('/', isAuthenticated, driveController.getDashboard);
router.post('/folders', isAuthenticated, driveController.createFolder);
router.post('/folders/:id/share', isAuthenticated, driveController.shareFolder);
router.post('/files/upload', isAuthenticated, upload.single('file'), driveController.uploadFile);
router.get('/files/:id', isAuthenticated, driveController.getFileDetails);

// Publicly exposed link matching route pattern bypasses isAuthenticated verification
router.get('/share/:shareId', driveController.getSharedFolder);

module.exports = router;

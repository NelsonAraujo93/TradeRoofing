-'use strict'

const express= require('express');
var validator = require('validator');
var router = express.Router();
//var md_uploadImage = multipart({uploadDir:'./images'});
var usersController = require('../controllers/usersController');
var adminController = require('../controllers/adminController');
var paymentController = require('../controllers/payments');
var servicesController = require('../controllers/servicesController');
var multer = require('multer');

var dateImage;
const storage= multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, "./uploads/images")
    },
    filename : (req, file, callback) =>{
        dateImage= Date.now();
        callback(null, dateImage+'<'+file.originalname);
    }
});

const upload = multer({storage:storage});

const storagePdf= multer.diskStorage({
    destination: (req, file, callback) =>{
        callback(null, "./uploads/invoices")
    },
    filename : (req, file, callback) =>{
        console.log(req);
        datePdf= Date.now();
        callback(null, datePdf+'-tRoofingApp.pdf');
    }
});

const uploadPdf = multer({storage:storagePdf});
//metodos get recibir rutas barberUser
//transactionsss

//Projects

router.get('/get-projects', usersController.getProducts);
router.get('/get-project/:id', usersController.getProjectById);
router.get('/get-projects/:id', usersController.getProjectsById);

router.post('/create-project', usersController.createProject);

router.put('/update-project', usersController.upDateProject);

router.delete('/delete-project', usersController.deleteProduct);


router.get('/get-types', usersController.getTypes);


//selectors
router.post('/create-categories', usersController.createCategory);
router.post('/create-types', usersController.createType);
router.get('/get-selector-providers', usersController.getSelectorProviders);

//reviews

router.post('/create-review', usersController.createReview);
router.get('/get-reviews-user/:id', usersController.getReviewsUser);

//payments
router.get('/sales-info/:id', paymentController.getSalesInfo);


//login
router.post('/login', usersController.login);
router.post('/create-user', usersController.createUserFirstStep);
router.post('/create-manager', usersController.createManager);
router.get('/auth-user', usersController.auth);
router.get('/get-user/:id', usersController.getUser);

router.put('/create-user-second', usersController.createUserSecondStep);
router.put('/activate-user', usersController.activateUser);
router.post('/mail', usersController.formularioCorreo);



router.post('/pay', paymentController.createSale);
//Admin-services

router.get('/get-users', adminController.getUsers);
router.get('/get-users-by-managerid/:id', adminController.getUsersByManagerId);
router.get('/get-managers', adminController.getManagers);
router.get('/get-services', adminController.getServices);
router.get('/get-history', adminController.getHistory);
router.get('/get-dashboard', adminController.getDashBoard);
router.get('/get-users-manager/:id', adminController.getUsersManager);

router.get('/get-unassigned-users', adminController.getUsersUnassigned);
router.put('/user-assing-manager', adminController.assingUser);
//router.get('/get-resquests', adminController.getRequests);





//Services
router.get('/get-service-user/:providerId/:state', servicesController.getProviderServices);

router.get('/get-active-service-project/:projectId', servicesController.getProjectActiveService);

router.get('/get-finished-services-project-id/:projectId', servicesController.getFinishedServicesById);

router.get('/get-finished-services-user-id/:userId', servicesController.getFinishedServicesByUserId);
router.get('/get-active-services-user-id/:userId', servicesController.getActiveServicesByUserId);
router.post('/create-service', servicesController.createService);

router.put('/update-service', servicesController.updateService);
router.put('/update-service-cams', servicesController.updateServiceCams);
router.put('/update-service-state-scheduled', servicesController.updateServiceState);
router.put('/update-service-state-working', servicesController.updateServiceStateWork);
router.put('/update-service-state-finished', servicesController.updateServiceStateFinished);
router.put('/update-service-upload-invoice', uploadPdf.single('file'), servicesController.uploadPDf);
router.put('/update-service-upload-images', uploadPdf.single('file'), servicesController.uploadPDfImages);


router.put('/update-service-cancel', servicesController.cancelService);
router.put('/finish-service', servicesController.finishService);


//Requests
router.post('/create-request', servicesController.createRequest);
router.get('/get-request', servicesController.getRequests);
router.get('/get-user-request/:userId', servicesController.getUserRequests);
router.put('/update-request', uploadPdf.single('file'), servicesController.uploadRequest);

//Company Cams
router.get('/get-project-images/:projectId/:companyCams', servicesController.getProjectImages)
router.get('/download-invoice/:fileName', servicesController.downloadPdf)
router.get('/download-image/:fileName', servicesController.downloadPdf)
router.get('/download-request/:fileName', servicesController.downloadPdf)



module.exports = router;
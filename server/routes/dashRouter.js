const router = require('express').Router();
const dashController = require('../controllers/dashController');
const authController = require('../controllers/authController');

router.get(
  '/:id/allresumes',
  authController.verifyUser,
  dashController.getResumes,
  (req, res) => {
    res.status(200).json(res.locals.resume);
  }
);

router.get(
  '/:id',
  authController.verifyUser,
  dashController.getApplications,
  (req, res) => {
    res.status(200).json(res.locals.application);
  }
);

router.post(
  '/:id/resume',
  authController.verifyUser,
  dashController.postResume,
  (req, res) => {
    res.status(200).send();
  }
);

router.post(
  '/:id/application',
  authController.verifyUser,
  dashController.postApplication,
  (req, res) => {
    res.status(200).send();
  }
);

router.delete(
  '/:id/application',
  authController.verifyUser,
  dashController.deleteApplication,
  (req, res) => {
    res.status(200).send();
  }
);

router.put('/:id/status', dashController.updateStatus, (req, res) => {
  res.status(200).send();
});

router.put('/:id/rating', dashController.updateRating, (req, res) => {
  res.status(200).send();
});

router.get('/:id', dashController.getApplications, (req, res) => {
  res.status(200).json(res.locals.application);
});

module.exports = router;

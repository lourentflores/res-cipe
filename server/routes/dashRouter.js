const router = require('express').Router();
const dashController = require('../controllers/dashController');

router.get('/:id/allresumes', dashController.getResumes, (req, res) => {
  res.status(200).json(res.locals.resume);
});

router.post('/:id/resume', dashController.postResume, (req, res) => {
  res.status(200).send();
});

router.post('/:id/application', dashController.postApplication, (req, res) => {
  res.status(200).send();
});

router.delete('/:id/delete', dashController.deleteApplication, (req, res) => {
  res.status(200).send();
});

router.put('/:id/status', dashController.updateStatus, (req, res) => {
  res.status(200).send();
})

router.put('/:id/rating', dashController.updateRating, (req, res) => {
  res.status(200).send()
})

router.get('/:id', dashController.getApplications, (req, res) => {
  res.status(200).json(res.locals.application);
});

module.exports = router;

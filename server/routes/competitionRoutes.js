const express = require('express');
const router = express.Router();
const controller = require('../controllers/competitionController');

router.get('/:id', controller.getCompetition);
router.post('/:id/register', controller.registerForCompetition);
router.post('/:id/unregister', controller.unregisterForCompetition);
router.post('/:id/submit', controller.submitForCompetition);

module.exports = router;

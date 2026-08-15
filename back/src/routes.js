const express = require('express');
const memoriaController = require('./controllers/memoriaController');
const skillController = require('./controllers/skillController');

const router = express.Router();

// Memoria routes
router.get('/memory/', memoriaController.listMemorias);
router.post('/memory/', memoriaController.createMemoria);
router.delete('/memory/', memoriaController.deleteMemoria);
router.get('/memory/:keyword', memoriaController.getMemoriasByKeyword);
router.patch('/memory/', memoriaController.updateMemoria);

// Skill routes
router.get('/skill/', skillController.listSkills);
router.post('/skill/', skillController.createSkill);
router.delete('/skill/', skillController.deleteSkill);
router.patch('/skill/', skillController.updateSkill);

module.exports = router;

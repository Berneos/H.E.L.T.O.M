
const skillService = require('../services/skillService');

async function listSkills(req, res) {
	try {
		const skills = await skillService.getAllSkills();
		return res.json(skills);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}

async function createSkill(req, res) {
	try {
		if (req.body.active !== undefined) req.body.active = Boolean(req.body.active);
		const created = await skillService.createSkill(req.body);
		return res.status(201).json(created);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
}

async function deleteSkill(req, res) {
	try {
		const id = req.params.id || req.body.id;
		if (!id) return res.status(400).json({ error: 'id is required' });
		const deleted = await skillService.deleteSkill(id);
		if (!deleted) return res.status(404).json({ error: 'Skill not found' });
		return res.json({ success: true, deleted });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}

async function updateSkill(req, res) {
	try {
		const id = req.params.id || req.body.id;
		if (!id) return res.status(400).json({ error: 'id is required' });
		if (req.body.active !== undefined) req.body.active = Boolean(req.body.active);
		const updated = await skillService.updateSkill(id, req.body);
		if (!updated) return res.status(404).json({ error: 'Skill not found' });
		return res.json(updated);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
}

module.exports = {
	listSkills,
	createSkill,
	deleteSkill,
	updateSkill,
};

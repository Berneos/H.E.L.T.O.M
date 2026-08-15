const Skill = require('../models/Skill');

async function getAllSkills() {
	return Skill.find().sort({ data: -1 }).exec();
}

async function createSkill(payload) {
	const { nome, data, nivel, categoria, active, tone } = payload;
	if (!nome) throw new Error('nome is required');
	if (!data) throw new Error('data is required');

	const skill = new Skill({
		nome,
		data: new Date(data),
		nivel,
		categoria,
		active: active === undefined ? true : Boolean(active),
		tone,
	});

	return skill.save();
}

async function deleteSkill(id) {
	if (!id) throw new Error('id is required');
	return Skill.findByIdAndDelete(id).exec();
}

async function updateSkill(id, updates) {
	if (!id) throw new Error('id is required');
	const allowed = ['nome', 'data', 'nivel', 'categoria', 'active', 'tone'];
	const set = {};
	for (const k of allowed) {
		if (updates[k] !== undefined) set[k] = updates[k];
	}
	if (set.data) set.data = new Date(set.data);
	if (set.active !== undefined) set.active = Boolean(set.active);
	return Skill.findByIdAndUpdate(id, set, { new: true }).exec();
}

module.exports = {
	getAllSkills,
	createSkill,
	deleteSkill,
	updateSkill,
};


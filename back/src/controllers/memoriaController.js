
const memoriaService = require('../services/memoriaService');

async function listMemorias(req, res) {
	try {
		const memorias = await memoriaService.getAllMemorias();
		return res.json(memorias);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}

async function createMemoria(req, res) {
	try {
		// Validate integrity if provided
		if (req.body.integrity !== undefined) {
			const val = Number(req.body.integrity);
			if (!Number.isFinite(val) || val < 0 || val > 100) {
				return res.status(400).json({ error: 'integrity must be a number between 0 and 100' });
			}
			req.body.integrity = val;
		}
		const created = await memoriaService.createMemoria(req.body);
		return res.status(201).json(created);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
}

async function deleteMemoria(req, res) {
	try {
		const id = req.params.id || req.body.id;
		if (!id) return res.status(400).json({ error: 'id is required' });
		const deleted = await memoriaService.deleteMemoria(id);
		if (!deleted) return res.status(404).json({ error: 'Memoria not found' });
		return res.json({ success: true, deleted });
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}

async function getMemoriasByKeyword(req, res) {
	try {
		const keyword = req.params.keyword || req.query.keyword || '';
		const results = await memoriaService.getMemoriasByKeyword(keyword);
		return res.json(results);
	} catch (err) {
		return res.status(500).json({ error: err.message });
	}
}

async function updateMemoria(req, res) {
	try {
		const id = req.params.id || req.body.id;
		if (!id) return res.status(400).json({ error: 'id is required' });
		if (req.body.integrity !== undefined) {
			const val = Number(req.body.integrity);
			if (!Number.isFinite(val) || val < 0 || val > 100) {
				return res.status(400).json({ error: 'integrity must be a number between 0 and 100' });
			}
			req.body.integrity = val;
		}
		const updated = await memoriaService.updateMemoria(id, req.body);
		if (!updated) return res.status(404).json({ error: 'Memoria not found' });
		return res.json(updated);
	} catch (err) {
		return res.status(400).json({ error: err.message });
	}
}

module.exports = {
	listMemorias,
	createMemoria,
	deleteMemoria,
	getMemoriasByKeyword,
	updateMemoria,
};

const Memoria = require('../models/Memoria');

async function getAllMemorias() {
	return Memoria.find().sort({ data: -1 }).exec();
}

async function deleteMemoria(id) {
	if (!id) throw new Error('id is required');
	return Memoria.findByIdAndDelete(id).exec();
}

async function getMemoriasByKeyword(keyword) {
	if (!keyword) return [];
	return Memoria.find({ palavraChave: { $regex: keyword, $options: 'i' } }).exec();
}

// Helper to normalize image input: accepts raw base64 or data URI and returns { base64, mimeType }
function parseImageInput(imagem) {
	if (!imagem) return { base64: undefined, mimeType: undefined };
	// data:[<mediatype>][;base64],<data>
	const dataUriMatch = imagem.match(/^data:(.+);base64,(.+)$/);
	if (dataUriMatch) {
		return { base64: dataUriMatch[2], mimeType: dataUriMatch[1] };
	}
	// Otherwise assume it's plain base64 with unknown mime
	return { base64: imagem, mimeType: undefined };
}

// Create memoria accepting imagem as base64 or data URI
async function createMemoria(payload) {
	const { titulo, data, descricao, palavraChave, imagem, integrity, nodeColor } = payload;
	if (!titulo) throw new Error('Titulo is required');
	if (!data) throw new Error('Data is required');

	const { base64, mimeType } = parseImageInput(imagem);

	const memoria = new Memoria({
		titulo,
		data: new Date(data),
		descricao,
		palavraChave,
		imagem: base64,
		imagemMimeType: mimeType,
		integrity: typeof integrity === 'number' ? Math.max(0, Math.min(100, integrity)) : undefined,
		nodeColor,
	});

	return memoria.save();
}

// Update memoria and handle imagem field
async function updateMemoria(id, updates) {
	if (!id) throw new Error('id is required');
	const allowed = ['titulo', 'data', 'descricao', 'palavraChave', 'imagem', 'integrity', 'nodeColor'];
	const set = {};
	for (const k of allowed) {
		if (updates[k] !== undefined) set[k] = updates[k];
	}
	if (set.data) set.data = new Date(set.data);
	if (set.imagem !== undefined) {
		const { base64, mimeType } = parseImageInput(set.imagem);
		set.imagem = base64;
		set.imagemMimeType = mimeType;
	}
	if (set.integrity !== undefined) {
		const val = Number(set.integrity);
		set.integrity = Number.isFinite(val) ? Math.max(0, Math.min(100, val)) : undefined;
	}
	return Memoria.findByIdAndUpdate(id, set, { new: true }).exec();
}

module.exports = {
	getAllMemorias,
	createMemoria,
	deleteMemoria,
	getMemoriasByKeyword,
	updateMemoria,
};


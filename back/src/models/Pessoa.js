
const mongoose = require('mongoose');

const PessoaSchema = new mongoose.Schema({
	nome: { type: String, required: true },
	memorias: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Memoria' }],
	skills: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Skill' }],
}, { timestamps: true });

module.exports = mongoose.model('Pessoa', PessoaSchema);

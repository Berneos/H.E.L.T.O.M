const mongoose = require('mongoose');

const MemoriaSchema = new mongoose.Schema({
  titulo: { type: String, required: true },
  data: { type: Date, required: true },
  descricao: { type: String },
  palavraChave: { type: String },
  // Image stored as base64 string. Optionally provide a data URI; service will parse mime type.
  imagem: { type: String },
  imagemMimeType: { type: String },
  // Integrity from 0 to 100 indicating how stable/important the memory is
  integrity: { type: Number, min: 0, max: 100, default: 100 },
  // Node color for frontend visualization (e.g. 'purple', 'green')
  nodeColor: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Memoria', MemoriaSchema);

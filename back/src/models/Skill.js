const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  data: { type: Date, required: true },
  nivel: { type: String },
}, { timestamps: true });

// Add category, active flag and tone color for frontend
SkillSchema.add({
  categoria: { type: String },
  active: { type: Boolean, default: true },
  tone: { type: String },
});

module.exports = mongoose.model('Skill', SkillSchema);

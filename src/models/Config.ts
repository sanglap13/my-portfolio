import mongoose, { Schema, model, models } from 'mongoose';

const ConfigSchema = new Schema({
  overlay: { type: Schema.Types.Mixed },
  about: { type: Schema.Types.Mixed },
  experience: { type: Schema.Types.Mixed },
  projects: { type: Schema.Types.Mixed },
  community: { type: Schema.Types.Mixed },
  informal: { type: Schema.Types.Mixed },
  footer: { type: Schema.Types.Mixed },
}, { 
  timestamps: true,
  // This allows the document to have fields not explicitly defined in the schema
  strict: false 
});

const Config = models.Config || model('Config', ConfigSchema);

export default Config;

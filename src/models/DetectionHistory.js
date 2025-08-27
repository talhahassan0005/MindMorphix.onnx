import mongoose from 'mongoose';

const DetectionHistorySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  imageData: {
    type: String, // Base64 encoded image data
    required: true
  },
  result: {
    primaryDetection: {
      type: String,
      required: true,
      enum: ['glioma', 'meningioma', 'notumor', 'pituitary']
    },
    confidence: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },
    allProbabilities: {
      glioma: { type: Number, min: 0, max: 1 },
      meningioma: { type: Number, min: 0, max: 1 },
      notumor: { type: Number, min: 0, max: 1 },
      pituitary: { type: Number, min: 0, max: 1 }
    },
    inferenceTime: {
      type: Number,
      required: true,
      min: 0
    }
  },
  processingTime: {
    type: Number,
    default: 0,
    min: 0
  },
  modelInfo: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  timestamp: {
    type: Date,
    default: Date.now,
    index: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
DetectionHistorySchema.index({ userId: 1, timestamp: -1 });

// Virtual for formatted date
DetectionHistorySchema.virtual('formattedDate').get(function() {
  return this.timestamp.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
});

// Method to get detection summary
DetectionHistorySchema.methods.getSummary = function() {
  return {
    id: this._id,
    primaryDetection: this.result.primaryDetection,
    confidence: this.result.confidence,
    inferenceTime: this.result.inferenceTime,
    timestamp: this.timestamp,
    formattedDate: this.formattedDate
  };
};

// Static method to get user statistics
DetectionHistorySchema.statics.getUserStats = async function(userId) {
  const stats = await this.aggregate([
    { $match: { userId: new mongoose.Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalDetections: { $sum: 1 },
        averageConfidence: { $avg: '$result.confidence' },
        averageInferenceTime: { $avg: '$result.inferenceTime' },
        detectionsByType: {
          $push: '$result.primaryDetection'
        }
      }
    }
  ]);

  if (stats.length === 0) {
    return {
      totalDetections: 0,
      averageConfidence: 0,
      averageInferenceTime: 0,
      detectionsByType: {}
    };
  }

  const stat = stats[0];
  const detectionsByType = stat.detectionsByType.reduce((acc, type) => {
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {});

  return {
    totalDetections: stat.totalDetections,
    averageConfidence: Math.round(stat.averageConfidence * 100) / 100,
    averageInferenceTime: Math.round(stat.averageInferenceTime * 100) / 100,
    detectionsByType
  };
};

const DetectionHistory = mongoose.models.DetectionHistory || mongoose.model('DetectionHistory', DetectionHistorySchema);

export default DetectionHistory;

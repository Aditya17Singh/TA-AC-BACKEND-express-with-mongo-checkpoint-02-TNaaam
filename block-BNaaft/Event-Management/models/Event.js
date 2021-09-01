var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var eventSchema = new Schema(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    host: { type: String, required: true },
    start_date: { type: Date },
    end_date: { type: Date },
    category: [String],
    location: { type: String, required: true },
    like: { type: Number, default: 0 },
    dislike: { type: Number, default: 0 },
    comments: [{ type: Schema.Types.ObjectId, ref: "Comment" }],
    image: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Event", eventSchema);

var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var commentSchema = new Schema({
  content: { type: String, required: true },
  bookId: { type: Schema.Types.ObjectId, ref: "Event", required: true },
  like: { type: Number, default: 0 },
});

module.exports = mongoose.model("Comment", commentSchema);

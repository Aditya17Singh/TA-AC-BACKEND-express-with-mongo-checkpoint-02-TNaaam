var express = require("express");
const Event = require("../models/Event");
var router = express.Router();

var Comment = require("../models/Comment");

router.get("/:id/edit", (req, res, next) => {
  var id = req.params.id;
  Comment.findById(id, (err, comment) => {
    if (err) return next(err);
    res.render("updateComment", { comment });
  });
});

router.post("/:id", (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, req.body, (err, updateComment) => {
    if (err) return next(err);
    res.redirect("/events/" + updateComment.bookId);
  });
});

router.get("/:id/delete", (req, res, next) => {
  var commentId = req.params.id;
  Comment.findByIdAndDelete(commentId, (err, comment) => {
    if (err) return next(err);
    Event.findByIdAndUpdate(
      comment.bookId,
      { $pull: { comments: comment.id } },
      (err, event) => {
        res.redirect("/events/" + comment.bookId);
      }
    );
  });
});

router.get("/:id/like", (req, res, next) => {
  var id = req.params.id;
  Comment.findByIdAndUpdate(id, { $inc: { like: 1 } }, (err, comment) => {
    if (err) return next(err);
    res.redirect("/events/" + comment.bookId);
  });
});
module.exports = router;

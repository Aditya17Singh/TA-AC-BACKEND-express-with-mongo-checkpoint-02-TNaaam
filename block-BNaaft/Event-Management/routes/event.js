var express = require("express");
var router = express.Router();
var loadash = require("loadsh");
const { format } = require("date-fns");

var Event = require("../models/Event");
var Comment = require("../models/Comment");

//sort by Dates
router.post("/filter/", (req, res, next) => {
  Event.find({}, (err, events) => {
    if (err) return next(err);
    let categories = events
      .reduce((acc, cv) => {
        acc.push(cv.category);
        return acc;
      }, [])
      .flat(Infinity);
    categories = loadash.uniq(categories);
    let location = events.reduce((acc, cv) => {
      acc.push(cv.location);
      return acc;
    }, []);
    location = loadash.uniq(location);
    Event.find(
      { start_date: { $gte: req.body.initialdate, $lt: req.body.finaldate } },
      (err, events) => {
        if (err) return next(err);
        console.log(events);
        res.render("events", { events, categories, location });
      }
    );
  });
});

router.get("/new", (req, res, next) => {
  res.render("addEvents");
});

router.post("/", (req, res, next) => {
  req.body.category = req.body.category.trim().split(" ");
  Event.create(req.body, (err, createdEvent) => {
    if (err) return next(err);
    res.redirect("/events");
  });
});

router.get("/", (req, res, next) => {
  Event.find({}, (err, events) => {
    if (err) return next(err);
    let categories = events
      .reduce((acc, cv) => {
        acc.push(cv.category);
        return acc;
      }, [])
      .flat(Infinity);
    categories = loadash.uniq(categories);
    let location = events.reduce((acc, cv) => {
      acc.push(cv.location);
      return acc;
    }, []);
    location = loadash.uniq(location);
    res.render("events", { events, categories, location });
  });
});

//fetch single event
// router.get("/:id", (req, res, next) => {
//   var id = req.params.id;
//   Event.findById(id, (err, event) => {
//     if (err) return next(err);
//     comment.find({ bookId: id }, (err, comments) => {
//       res.render("eventDetails", { event, comments });
//     });
//   });
// });

router.get("/:id", (req, res, next) => {
  var id = req.params.id;
  Event.findById(id, (err, event) => {
    Event.findById(id)
      .populate("comments")
      .exec((err, event) => {
        if (err) return next(err);
        let startDate = format(event.start_date, "yyyy/MM//dd");
        let endDate = format(event.end_date, "yyyy/MM//dd");
        res.render("eventDetails", { event, startDate, endDate });
      });
  });
});

//Edit
router.get("/:id/edit", (req, res) => {
  var id = req.params.id;
  Event.findById(id, (err, event) => {
    event.category = event.category.join(" ");
    if (err) return next(err);
    res.render("editEventForm", { event });
  });
});
//Update events
router.post("/:id", (req, res, next) => {
  var id = req.params.id;
  req.body.category = req.body.category.split(" ");
  Event.findByIdAndUpdate(id, req.body, (err, updateData) => {
    if (err) return next(err);
    res.redirect("/events/" + id);
  });
});
//delete
router.get("/:id/delete", (req, res, next) => {
  var id = req.params.id;
  Event.findByIdAndDelete(id, (err, event) => {
    if (err) return next(err);
    res.redirect("/events");
  });
});

//likes
router.get("/:id/like", (req, res, next) => {
  var id = req.params.id;
  Event.findByIdAndUpdate(id, { $inc: { like: 1 } }, (err, event) => {
    if (err) return next(err);
    res.redirect("/events/" + id);
  });
});

//Add comment
router.post("/:id/comments", (req, res, next) => {
  var id = req.params.id;
  req.body.bookId = id;
  Comment.create(req.body, (err, comment) => {
    if (err) return next(err);
    console.log(comment);
    //update book with comment id into comment sections
    Event.findByIdAndUpdate(
      id,
      { $push: { comments: comment.id } },
      (err, updatedevent) => {
        if (err) return next(err);
        res.redirect("/events/" + id);
      }
    );
  });
});

//sort by category
router.get("/category/:id", (req, res, next) => {
  var id = req.params.id;
  Event.find({ category: { $in: [id] } }, (err, events) => {
    if (err) return next(err);
    Event.distinct("category", (err, categories) => {
      if (err) return next(err);
      Event.distinct("location", (err, location) => {
        if (err) return next(err);
        res.render("events", { events, categories, location });
      });
    });
  });
});

router.get("/location/:id", (req, res, next) => {
  var id = req.params.id;
  Event.find({ location: { $in: [id] } }, (err, events) => {
    if (err) return next(err);
    Event.distinct("location", (err, location) => {
      if (err) return next(err);
      Event.distinct("categories", (err, categories) => {
        if (err) return next(err);
        res.render("events", { events, location, categories });
      });
    });
  });
});

module.exports = router;

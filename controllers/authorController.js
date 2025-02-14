const Author = require("../models/author");
const Book = require("../models/book");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require('express-validator');

// Display list of all Authors.
exports.author_list = asyncHandler(async (req, res, next) => {
  const allAuthors = await Author.find().sort({ lastName: 1 }).exec();
  res.render("author_list", {
    title: "Author List",
    author_list: allAuthors,
  });
});

// Display detail page for a specific Author.
exports.author_detail = asyncHandler(async (req, res, next) => {
  const [author, books] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({author: req.params.id}, "title summary").exec(),
  ])

  
  if (author === null) {
    // No results.
    const err = new Error("Author not found");
    err.status = 404;
    return next(err);
  }

  res.render('author_detail', {author, books});
});

// Display Author create form on GET.
exports.author_create_get = asyncHandler(async (req, res, next) => {
  res.render('author_form', {title: "Create Author"});
});

// Handle Author create on POST.
exports.author_create_post = [
  // Validate and sanitize fields.
  body("first_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("First name must be specified."),
  body("family_name")
    .trim()
    .isLength({ min: 1 })
    .escape()
    .withMessage("Family name must be specified."),
  body("date_of_birth", "Invalid date of birth")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),
  body("date_of_death", "Invalid date of death")
    .optional({ values: "falsy" })
    .isISO8601()
    .toDate(),

  // Process request after validation and sanitization.
  asyncHandler(async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create Author object with escaped and trimmed data
    const author = new Author({
      firstName: req.body.first_name,
      lastName: req.body.family_name,
      dataOfBirth: req.body.date_of_birth,
      dateOfDeath: req.body.date_of_death,
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/errors messages.
      res.render("author_form", {
        title: "Create Author",
        author: author,
        errors: errors.array(),
      });
      return;
    } else {
      // Data from form is valid.

      // Save author.
      await author.save();
      // Redirect to new author record.
      res.redirect(author.url);
    }
  }),
];


// Display Author delete form on GET.
exports.author_delete_get = asyncHandler(async (req, res, next) => {
  const [author, authorAllBooks] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({author: req.params.id}).select("title summary").exec(),
  ])
  if(author == null) {
    res.redirect('/calalog/authors')
  }
  res.render('author_delete', {
    title: "Delete Author",
    author: author,
    author_books: authorAllBooks,
  })
});

// Handle Author delete on POST.
exports.author_delete_post = asyncHandler(async (req, res, next) => {
  const [author, authorAllBooks] = await Promise.all([
    Author.findById(req.params.id).exec(),
    Book.find({author: req.params.id}).select("title summary").exec(),
  ])

  if(authorAllBooks.length > 0) {
    res.render('author_delete', {
      title: "Delete Author",
      author: author,
      author_books: authorAllBooks,
    })
    return;
  }
  else {
    await Author.findByIdAndDelete(req.body.authorid);
    console.log("deleted")
    res.redirect("/catalog/authors");
  }

});

// Display Author update form on GET.
exports.author_update_get = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update GET");
});

// Handle Author update on POST.
exports.author_update_post = asyncHandler(async (req, res, next) => {
  res.send("NOT IMPLEMENTED: Author update POST");
});

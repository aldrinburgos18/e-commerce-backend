const router = require("express").Router();
const res = require("express/lib/response");
const { Category, Product } = require("../../models");

// The `/api/categories` endpoint

router.get("/", (req, res) => {
  // find all categories
  Category.findAll({
    //include associated Products
    include: {
      model: Product,
      attributes: { exclude: ["category_id"] },
    },
  })
    .then((dbData) => res.json(dbData))
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.get("/:id", (req, res) => {
  // find one category
  Category.findOne({
    where: {
      id: req.params.id,
    },
    //include associated Products
    include: {
      model: Product,
      attributes: { exclude: ["category_id"] },
    },
  }).then((dbData) => {
    if (!dbData) {
      res.status(404).json({ message: "No category found with that ID!" });
      return;
    }
    res.json(dbData);
  });
});

router.post("/", (req, res) => {
  // create a new category
  Category.create({
    category_name: req.body.category_name,
  })
    .then((dbData) =>
      res.json({
        message: "Category successfully created!",
        added_category: dbData,
      })
    )
    .catch((err) => {
      console.log(err);
      res.status(400).json(err);
    });
});

router.put("/:id", (req, res) => {
  // update a category by its `id` value
  Category.update(
    {
      category_name: req.body.category_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbData) => {
      if (!dbData[0]) {
        res.status(404).json({ message: "No category found with that ID!" });
        return;
      }
      res.json({
        message: `Category with ID: ${req.params.id} successfully updated to '${req.body.category_name}'!`,
        changes: dbData,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.delete("/:id", (req, res) => {
  // delete a category by its `id` value
  Category.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbData) => {
      if (!dbData) {
        res.status(404).json({ message: "No category found with that ID!" });
        return;
      }
      res.json({ message: "Category successfully deleted." });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;

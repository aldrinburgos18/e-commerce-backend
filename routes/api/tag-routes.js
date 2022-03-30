const router = require("express").Router();
const { Tag, Product, ProductTag, Category } = require("../../models");

// The `/api/tags` endpoint

router.get("/", (req, res) => {
  // find all tags
  Tag.findAll({
    // include associated Product data
    include: {
      model: Product,
      attributes: ["id", "product_name", "price", "stock"],
      as: "products",
    },
  })
    .then((dbData) => res.json(dbData))
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.get("/:id", (req, res) => {
  // find a single tag by its `id`
  Tag.findOne({
    where: {
      id: req.params.id,
    },
    // be sure to include its associated Product data
    include: {
      model: Product,
      attributes: ["id", "product_name", "price", "stock"],
      as: "products",
    },
  })
    .then((dbData) => {
      if (!dbData) {
        res.status(404).json({ message: "No tag found with that ID!" });
        return;
      }
      res.json(dbData);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.post("/", (req, res) => {
  // create a new tag
  Tag.create({
    tag_name: req.body.tag_name,
  })
    .then((dbData) => {
      res.json({ message: "Tag successfully created!", added_tag: dbData });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

router.put("/:id", (req, res) => {
  // update a tag's name by its `id` value
  Tag.update(
    {
      tag_name: req.body.tag_name,
    },
    {
      where: {
        id: req.params.id,
      },
    }
  )
    .then((dbData) => {
      if (!dbData[0]) {
        res.status(404).json({ message: "No tag found with that ID!" });
        return;
      }
      res.json({
        message: `Tag with ID: ${req.params.id} successfully updated to '${req.body.tag_name}'!`,
        changes: dbData,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});
router.delete("/:id", (req, res) => {
  // delete on tag by its `id` value
  Tag.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dbData) => {
      if (!dbData) {
        res.status(404).json({ message: "No tag found with that ID!" });
        return;
      }
      res.json({ message: "Tag successfully deleted." });
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json(err);
    });
});

module.exports = router;

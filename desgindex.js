const Desg = require("./model/desg.model.js");
const express = require("express");
const router = express.Router();

// Basic start page info
router.get(`/`, (req, res) => {
  res.send("Employee & Designation");
});

// Route to get all designation (with or without search query)
router.get("/comp/desg", async (req, res) => {
  try {
    const query = req.query.q;
    let desg;
    if (query) {
      desg = await Desg.find({
        $or: [
          { desg_name: { $regex: query, $options: "i" } },
          { dept_name: { $regex: query, $options: "i" } },
        ],
      });
    } else {
      desg = await Desg.find({});
    }
    res.status(200).json(desg);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to get a specific desg by ID
router.get("/comp/desg/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const desg = await Desg.findById(id);
    res.status(200).json(desg);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to add a new desg in designation
router.post("/comp/desg", async (req, res) => {
  try {
    const existingDesg = await Desg.findOne({ desg_name: req.body.desg_name });
    if (!existingDesg) {
      const desg = await Desg.create(req.body);
      return res.status(200).json(desg);
    }
    return res.status(400).send("Designation already exists.");
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to update a designation
router.patch("/comp/desg/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const desg = await Desg.findByIdAndUpdate(id, {
      desg_name: req.body.desg_name,
      dept_name: req.body.dept_name,
    });
    if (!desg) {
      console.log(error);
      return res.status(404).json({ message: "Designation not found" });
    }
    const updatedDesg = await Desg.findById(id);
    res.status(200).json(updatedDesg);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
  }
});

// Route to delete an designation
router.delete("/comp/desg/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id)
      return res.status(404).json({ message: "Designation id not found" });
    const desg = await Desg.findByIdAndDelete(id);
    if (!desg)
      return res.status(404).json({ message: "Designation not found" });
    res.status(200).json({ message: "Designation deleted", desg });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

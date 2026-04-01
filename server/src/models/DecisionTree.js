// src/models/DecisionTree.js
import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema({
  text: { type: String, required: true },
  nextNodeId: { type: String }, // optional
});

const NodeSchema = new mongoose.Schema({
  id: { type: String, required: true },
  text: { type: String, required: true },
  options: [OptionSchema],
});

const DecisionTreeSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  nodes: [NodeSchema],
});

const DecisionTree = mongoose.model("DecisionTree", DecisionTreeSchema);

export default DecisionTree; // ✅ ES module export
import mongoose from "mongoose";

export const DIETS = ["veg", "vegan", "keto", "non-veg"];
export const DIFFICULTIES = ["easy", "medium", "hard"];

const ingredientSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    qty: { type: Number, required: true, min: 0 },
    unit: { type: String, trim: true },
  },
  { _id: false },
);

const stepSchema = new mongoose.Schema(
  {
    order: { type: Number, required: true, min: 1 },
    text: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const recipeSchema = new mongoose.Schema(
  {
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true, trim: true, maxlength: 120 },
    slug: { type: String, required: true, unique: true },
    description: { type: String, trim: true, maxlength: 500 },
    coverUrl: { type: String, required: true },
    imageCredit: { photographerName: String, photographerUrl: String, sourceUrl: String },
    cuisine: { type: String, required: true },
    diet: { type: String, enum: DIETS, required: true },
    difficulty: { type: String, enum: DIFFICULTIES, required: true },
    cookTime: { type: Number, required: true, min: 1 },
    servings: { type: Number, required: true, min: 1 },
    tags: [{ type: String, lowercase: true, trim: true }],
    ingredients: { type: [ingredientSchema], validate: (items) => items.length > 0 },
    steps: { type: [stepSchema], validate: (items) => items.length > 0 },
    ratingSum: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
  },
  { timestamps: true },
);

recipeSchema.index(
  { title: "text", tags: "text", "ingredients.name": "text" },
  { weights: { title: 10, tags: 5, "ingredients.name": 3 } },
);
recipeSchema.index({ diet: 1, _id: -1 });
recipeSchema.index({ cuisine: 1, _id: -1 });
recipeSchema.index({ authorId: 1, _id: -1 });

export default mongoose.model("Recipe", recipeSchema);

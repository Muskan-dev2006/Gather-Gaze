import cloudinary from "cloudinary";
import mongoose from "mongoose";
import { readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import Like from "../models/Like.js";
import Recipe from "../models/Recipe.js";
import Review from "../models/Review.js";
import User from "../models/User.js";
import { connectDatabase } from "../config/database.js";
import seedData from "./seedData.js";

const PIXABAY_ENDPOINT = "https://pixabay.com/api/";
const PIXABAY_IMAGE_LIMIT = 5;
const PIXABAY_MIN_WIDTH = 1000;
const PIXABAY_REQUEST_DELAY_MS = 1000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
const CLOUDINARY_FOLDER = "gather-gaze/seed-recipes";
const REVIEW_COUNT_PER_RECIPE = 3;
const LIKE_COUNT_PER_RECIPE = 2;
const REVIEW_RATINGS = [5, 4, 5, 3, 4];
const REVIEW_COMMENTS = [
  "Bright flavors and easy to follow.",
  "This turned out delicious for dinner.",
  "A lovely dish; I will make it again.",
  "The seasoning is balanced and comforting.",
  "Fresh, satisfying, and great for sharing.",
];
const DEMO_USERS = [
  { googleId: "seed-user-1", email: "nora.bennett@example.test", name: "Nora Bennett" },
  { googleId: "seed-user-2", email: "mateo.rivera@example.test", name: "Mateo Rivera" },
  { googleId: "seed-user-3", email: "aisha.khan@example.test", name: "Aisha Khan" },
  { googleId: "seed-user-4", email: "lucia.moretti@example.test", name: "Lucia Moretti" },
  { googleId: "seed-user-5", email: "daniel.park@example.test", name: "Daniel Park" },
];
const scriptDirectory = dirname(fileURLToPath(import.meta.url));
const cachePath = resolve(scriptDirectory, ".pixabay-cache.json");
let lastPixabayRequestAt = 0;

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function runSeed() {
  requireSeedConfiguration();
  await connectDatabase();
  try {
    const resetRequested = process.argv.includes("--reset");
    if (resetRequested) await resetDemoData();
    const users = await upsertDemoUsers();
    const cache = await readPixabayCache();
    const summary = { inserted: 0, existing: 0, noPhoto: [] };

    for (const [index, recipeData] of seedData.entries()) {
      const outcome = await seedRecipe(recipeData, index, users, cache);
      if (outcome.status === "no-photo") summary.noPhoto.push(recipeData.title);
      if (outcome.status === "inserted") summary.inserted += 1;
      if (outcome.status === "existing") summary.existing += 1;
      process.stdout.write(`${outcome.label} ${index + 1}/${seedData.length} ${recipeData.title}\n`);
    }

    process.stdout.write(formatSummary(summary));
  } finally {
    await mongoose.disconnect();
  }
}

async function seedRecipe(recipeData, index, users, cache) {
  const slug = slugify(recipeData.title);
  const author = users[index % users.length];
  let recipe = await Recipe.findOne({ slug });
  let status = "existing";

  if (!recipe) {
    const photo = await getPixabayPhoto(recipeData.photoQuery, cache);
    if (!photo) return { status: "no-photo", label: "Skipped (no Pixabay result)" };
    const coverUrl = await uploadRecipePhoto(photo.largeImageURL, slug, recipeData.title);
    recipe = await insertRecipe(recipeData, slug, author, coverUrl, photo);
    status = "inserted";
  }

  if (isDemoUserId(recipe.authorId, users)) {
    const recipeAuthor = users.find(({ _id }) => String(_id) === String(recipe.authorId)) || author;
    await upsertRecipeActivity(recipe, users, index, recipeAuthor);
    await refreshRecipeCounters(recipe._id);
  }
  return { status, label: status === "inserted" ? "Seeded" : "Existing" };
}

async function insertRecipe(recipeData, slug, author, coverUrl, photo) {
  const recipeFields = { ...recipeData };
  delete recipeFields.photoQuery;
  return Recipe.findOneAndUpdate(
    { slug },
    {
      $setOnInsert: {
        ...recipeFields,
        slug,
        authorId: author._id,
        coverUrl,
        imageCredit: { photographerName: photo.user, photographerUrl: "", sourceUrl: photo.pageURL },
        ratingSum: 0,
        ratingCount: 0,
        likeCount: 0,
      },
    },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  );
}

async function upsertRecipeActivity(recipe, users, recipeIndex, author) {
  const reviewers = getReviewers(users, author._id, recipeIndex);
  await Promise.all(reviewers.map((user, reviewerIndex) => {
    const ratingIndex = (recipeIndex + reviewerIndex) % REVIEW_RATINGS.length;
    const commentIndex = (recipeIndex + reviewerIndex) % REVIEW_COMMENTS.length;
    return Review.findOneAndUpdate(
      { recipeId: recipe._id, userId: user._id },
      { $setOnInsert: { recipeId: recipe._id, userId: user._id, rating: REVIEW_RATINGS[ratingIndex], comment: REVIEW_COMMENTS[commentIndex] } },
      { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
    );
  }));

  await Promise.all(reviewers.slice(0, LIKE_COUNT_PER_RECIPE).map((user) => Like.findOneAndUpdate(
    { recipeId: recipe._id, userId: user._id },
    { $setOnInsert: { recipeId: recipe._id, userId: user._id } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  )));
}

function getReviewers(users, authorId, recipeIndex) {
  const candidates = users.filter(({ _id }) => String(_id) !== String(authorId));
  return Array.from({ length: REVIEW_COUNT_PER_RECIPE }, (_, offset) => candidates[(recipeIndex + offset) % candidates.length]);
}

async function refreshRecipeCounters(recipeId) {
  const [ratingStats] = await Review.aggregate([
    { $match: { recipeId } },
    { $group: { _id: null, ratingSum: { $sum: "$rating" }, ratingCount: { $sum: 1 } } },
  ]);
  const likeCount = await Like.countDocuments({ recipeId });
  await Recipe.updateOne({ _id: recipeId }, {
    $set: { ratingSum: ratingStats?.ratingSum || 0, ratingCount: ratingStats?.ratingCount || 0, likeCount },
  });
}

async function getPixabayPhoto(photoQuery, cache) {
  const cached = cache[photoQuery];
  if (cached && Array.isArray(cached.hits) && Date.now() - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.hits.find(hasLargeImage) || null;
  }

  await waitForPixabaySlot();
  const url = new URL(PIXABAY_ENDPOINT);
  const parameters = {
    key: process.env.PIXABAY_API_KEY,
    q: photoQuery,
    image_type: "photo",
    orientation: "horizontal",
    category: "food",
    safesearch: "true",
    min_width: String(PIXABAY_MIN_WIDTH),
    per_page: String(PIXABAY_IMAGE_LIMIT),
  };
  for (const [key, value] of Object.entries(parameters)) url.searchParams.set(key, value);

  const response = await fetch(url);
  const payload = await response.json().catch(() => ({}));
  if (response.status === 429) throw new Error("Pixabay rate limit reached. Wait before running the seed script again.");
  if (isInvalidPixabayKey(response.status, payload.error)) throw new Error("Pixabay rejected the API key. Check PIXABAY_API_KEY in server/.env.");
  if (!response.ok || payload.error) throw new Error(`Pixabay request failed with status ${response.status}.`);

  const hits = Array.isArray(payload.hits) ? payload.hits : [];
  cache[photoQuery] = { fetchedAt: Date.now(), hits };
  await writeFile(cachePath, JSON.stringify(cache, null, 2));
  return hits.find(hasLargeImage) || null;
}

function isInvalidPixabayKey(status, message = "") {
  return [400, 401, 403].includes(status) || /invalid.*key|api key/i.test(message);
}

function hasLargeImage(hit) {
  return Boolean(hit?.largeImageURL && hit?.pageURL && hit?.user);
}

async function waitForPixabaySlot() {
  const waitTime = PIXABAY_REQUEST_DELAY_MS - (Date.now() - lastPixabayRequestAt);
  if (lastPixabayRequestAt && waitTime > 0) await delay(waitTime);
  lastPixabayRequestAt = Date.now();
}

async function uploadRecipePhoto(imageUrl, slug, title) {
  try {
    const result = await cloudinary.v2.uploader.upload(imageUrl, {
      folder: CLOUDINARY_FOLDER,
      public_id: slug,
      overwrite: true,
      unique_filename: false,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    if (error.http_code === 401) throw new Error("Cloudinary rejected its credentials. Check the Cloudinary values in server/.env.");
    throw new Error(`Cloudinary could not upload the photo for ${title}.`);
  }
}

async function upsertDemoUsers() {
  return Promise.all(DEMO_USERS.map(({ googleId, email, name }) => User.findOneAndUpdate(
    { googleId },
    { $set: { email, name }, $setOnInsert: { googleId } },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true },
  )));
}

async function resetDemoData() {
  const googleIds = DEMO_USERS.map(({ googleId }) => googleId);
  const demoUsers = await User.find({ googleId: { $in: googleIds } }).select("_id").lean();
  const userIds = demoUsers.map(({ _id }) => _id);
  if (!userIds.length) return;

  const demoRecipes = await Recipe.find({ authorId: { $in: userIds } }).select("_id").lean();
  const demoRecipeIds = demoRecipes.map(({ _id }) => _id);
  const [reviewRecipeIds, likeRecipeIds] = await Promise.all([
    Review.distinct("recipeId", { userId: { $in: userIds } }),
    Like.distinct("recipeId", { userId: { $in: userIds } }),
  ]);
  await Review.deleteMany({ userId: { $in: userIds } });
  await Like.deleteMany({ userId: { $in: userIds } });

  const retainedRecipeIds = await getExternallyReferencedRecipes(demoRecipeIds, userIds);
  const retained = new Set(retainedRecipeIds.map(String));
  const deletableRecipeIds = demoRecipeIds.filter((id) => !retained.has(String(id)));
  await Recipe.deleteMany({ _id: { $in: deletableRecipeIds } });

  const retainedAuthorIds = await Recipe.distinct("authorId", { _id: { $in: retainedRecipeIds } });
  const removableUserIds = userIds.filter((id) => !retainedAuthorIds.some((authorId) => String(authorId) === String(id)));
  await User.deleteMany({ _id: { $in: removableUserIds } });
  const affectedRecipeIds = new Set([...reviewRecipeIds, ...likeRecipeIds, ...retainedRecipeIds].map(String));
  for (const recipeId of affectedRecipeIds) await refreshRecipeCounters(recipeId);
}

async function getExternallyReferencedRecipes(recipeIds, demoUserIds) {
  if (!recipeIds.length) return [];
  const match = { recipeId: { $in: recipeIds }, userId: { $nin: demoUserIds } };
  const [reviewed, liked] = await Promise.all([Review.distinct("recipeId", match), Like.distinct("recipeId", match)]);
  return [...new Set([...reviewed, ...liked].map(String))].map((id) => recipeIds.find((recipeId) => String(recipeId) === id));
}

async function readPixabayCache() {
  try {
    const cached = JSON.parse(await readFile(cachePath, "utf8"));
    return cached && typeof cached === "object" && !Array.isArray(cached) ? cached : {};
  } catch (error) {
    if (error.code === "ENOENT") return {};
    if (error instanceof SyntaxError) return {};
    throw new Error("Could not read the Pixabay cache file.");
  }
}

function requireSeedConfiguration() {
  const requiredKeys = ["MONGODB_URI", "PIXABAY_API_KEY", "CLOUDINARY_CLOUD_NAME", "CLOUDINARY_API_KEY", "CLOUDINARY_API_SECRET"];
  const missingKeys = requiredKeys.filter((key) => !process.env[key]);
  if (missingKeys.length) throw new Error(`Missing seed configuration: ${missingKeys.join(", ")}. Set them in server/.env.`);
}

function isDemoUserId(userId, users) {
  return users.some(({ _id }) => String(_id) === String(userId));
}

function formatSummary({ inserted, existing, noPhoto }) {
  const skipped = noPhoto.length ? `; no Pixabay result: ${noPhoto.join(", ")}` : "; no Pixabay results: 0";
  return `Seed summary: inserted ${inserted}, existing ${existing}${skipped}.\n`;
}

function slugify(title) {
  return title.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function delay(milliseconds) {
  return new Promise((resolveDelay) => setTimeout(resolveDelay, milliseconds));
}

runSeed().catch((error) => {
  process.stderr.write(`${error.message}\n`);
  process.exitCode = 1;
}).finally(async () => {
  if (mongoose.connection.readyState !== 0) await mongoose.disconnect();
});

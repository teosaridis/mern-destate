import MyLinks from "../models/mylinks.model.js";
import { errorHandler } from "../utils/error.js";

export const createMyLink = async (req, res, next) => {
  if (!req.user.isAdmin) {
    return next(errorHandler(403, "You are not allowed to create a post!"));
  }
  // req.body.title === "asdas";
  // req.body.myShortlink === "sad";
  // req.body.mylink === "asd";
  // req.body.content === "asasdasdd";

  // if (
  //   !req.body.title ||
  //   !req.body.content ||
  //   !req.body.myShortlink ||
  //   !req.body.mylink
  // ) {
  //   return next(errorHandler(400, "!!Please provide all required fields!"));
  // }
  const slug = req.body.title
    .toLowerCase() // Convert the title to lowercase
    .replace(/\s+/g, "-") // Replace spaces with dashes
    .replace(/[^\w\-]+/g, "") // Remove non-word characters except dashes
    .replace(/\-\-+/g, "-") // Replace multiple consecutive dashes with a single dash
    .replace(/^\-+/, "") // Remove dashes from the beginning
    .replace(/\-+$/, ""); // Remove dashes from the end

  const newLink = new MyLinks({
    ...req.body,
    slug: slug,
    userId: req.user.id,
  });
  try {
    const savedLink = await newLink.save();
    console.log("Done!!!");
    res.status(201).json(savedLink);
  } catch (error) {
    next(error);
  }
};
export const getMyLinks = async (req, res, next) => {};

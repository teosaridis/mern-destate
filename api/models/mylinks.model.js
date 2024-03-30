import mongoose from "mongoose";

const mylinksSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    content: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      default: "../src/assets/common/default-post-photo.jpg",
    },
    category: {
      type: String,
      default: "uncategorized",
    },
    myLink: {
      type: String,
      required: true,
    },
    buttonTitle: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    clicks: {
      type: Number,
    },
    likes: {
      type: Number,
    },
  },
  { timestamps: true }
);

const MyLinks = mongoose.model("Mylinks", mylinksSchema);

export default MyLinks;

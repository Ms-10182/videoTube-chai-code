import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { deleteOldAsset } from "../utils/deleteOldAsset.js";


const getAllVideos = asyncHandler(async (req, res) => {
  const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  //TODO: get all videos based on query, sort, pagination
});


const publishAVideo = asyncHandler(async (req, res) => {
  const { title, description } = req.body;
  // TODO: get video, upload to cloudinary, create video

  if ([title, description].some((item) => item?.trim() === "")) {
    throw new ApiError(400, "Title and description are required.");
  }

  if (!req.files || !req.files.videoFile || !req.files.thumbnail) {
    throw new ApiError(400, "Video file and thumbnail are required.");
  }

  const videolocalPath = req.files.videoFile[0]?.path;
  const thumbnailPath = req.files.thumbnail[0]?.path;

  if (!videolocalPath) {
    throw new ApiError(400, "Video file path is not available.");
  }
  if (!thumbnailPath) {
    throw new ApiError(400, "Thumbnail file path is not available.");
  }

  let videoFile, thumbnailFile;
  try {
    videoFile = await uploadOnCloudinary(videolocalPath);
    thumbnailFile = await uploadOnCloudinary(thumbnailPath);
  } catch (error) {
    throw new ApiError(500, "Error uploading files to Cloudinary.");
  }

  if (!videoFile || !videoFile.url) {
    throw new ApiError(400, "Video upload failed.");
  }
  if (!thumbnailFile || !thumbnailFile.url) {
    throw new ApiError(400, "Thumbnail upload failed.");
  }

  const video = await Video.create({
    videoFile: videoFile.url,
    thumbnail: thumbnailFile.url,
    title,
    description,
    duration: videoFile?.duration || 0, // Ensure duration is safely accessed
    views: 0,
    isPublished: true,
    owner: req.user?._id,
  });

  res
    .status(200)
    .json(new ApiResponse(200, video, "Video uploaded successfully."));
});

const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing video ID.");
  }

  if (!videoId) {
    throw new ApiError(400, "video Id is required");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "video not found");
  }

  res
    .status(200)
    .json(new ApiResponse(200, video, "video retrived sucessfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing video ID.");
  }

  if (!videoId) {
    throw new ApiError(400, "Video ID not provided.");
  }

  const { title, description } = req.body;

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  if (title) {
    video.title = title;
  }

  if (description) {
    video.description = description;
  }

  if (req.files?.thumbnail?.[0]?.path) {
    const oldThumbnail = video.thumbnail;
    try {
      await deleteOldAsset(oldThumbnail);
    } catch (error) {
      throw new ApiError(500, "Failed to delete old thumbnail.");
    }
    const thumbnailPath = req.files.thumbnail[0].path;
    const thumbnailFile = await uploadOnCloudinary(thumbnailPath);
    video.thumbnail = thumbnailFile.url;
  }

  await video.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, video, "Video updated successfully."));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing video ID.");
  }

  if (!videoId) {
    throw new ApiError(400, "video id not found");
  }

  const video = await Video.findById(videoId); // Added await here to fetch the video

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  try {
    await deleteOldAsset(video.thumbnail);
    await deleteOldAsset(video.videoFile);
  } catch (error) {
    throw new ApiError(500, "Failed to delete video assets.");
  }

  await video.deleteOne(); // Delete the video document from the database

  res.status(200).json(new ApiResponse(200, null, "Video deleted successfully."));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!videoId || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid or missing video ID.");
  }

  if (!videoId) {
    throw new ApiError(400, "Video ID not provided.");
  }

  const video = await Video.findById(videoId);

  if (!video) {
    throw new ApiError(404, "Video not found.");
  }

  video.isPublished = !video.isPublished;
  await video.save({validateBeforeSave:false});

  res.status(200).json(new ApiResponse(200, video, "Publish status toggled successfully."));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
};

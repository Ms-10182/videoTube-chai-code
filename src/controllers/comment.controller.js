import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { refreshAccessToken } from "./user.controller.js";

const getVideoComments = asyncHandler(async (req, res) => {
  //TODO: get all comments for a video
  const { videoId } = req.params;

  const limit = parseInt(req.query?.limit || 10);
  const page = parseInt(req.query?.page || 1);

  if (!videoId) {
    throw new ApiError(400, "video ID is required");
  }

  if (!req.user) {
    throw new ApiError(401, "you are not authorized");
  }

  const isVideoExisting = await Video.findById(videoId);

  if (!isVideoExisting) {
    throw new ApiError(404, "video not found");
  }

  const pipeline = [
    {
      $match: {
        video: new mongoose.Types.ObjectId(videoId),
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "comment_owner",
        pipeline: [
          {
            $project: {
              password: 0,
              refreshToken: 0,
              watchHistory: 0,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        comment_owner: {
          $first: "$comment_owner",
        },
      },
    },
  ];

  const options = {
    page: page,
    limit: limit,
  };

  const comments = await Comment.aggregatePaginate(
    Comment.aggregate(pipeline),
    options
  );

  res
    .status(200)
    .json(new ApiResponse(200, comments, "comments retrived sucessfully"));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  let { content } = req.body;

  if (!req.user || !req.user._id) {
    throw new ApiError(401, "User not authenticated");
  }

  if (!videoId) {
    throw new ApiError(400, "Video ID is required");
  }

  if (!content || content.trim() === "") {
    throw new ApiError(400, "Comment content is required");
  }

  content = content.trim();

  const existingVideo = await Video.findById(videoId);
  if (!existingVideo) {
    throw new ApiError(404, "Video with the given ID does not exist");
  }

  const newComment = await Comment.create({
    content,
    video: videoId,
    owner: req.user._id,
  });

  res
    .status(201)
    .json(new ApiResponse(201, newComment, "Comment added successfully!"));
});

const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  let {content} = req.body;

  if (!commentId || !content || content.trim() === "") {
    throw new ApiError("comment id is required");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "comment not found");
  }

  const isOwnerValid = req.user?._id.toString() === comment.owner.toString();

  if (!isOwnerValid) {
    throw new ApiError(401, "you are not authorized to edit the comment");
  }

  content = content.trim();
  comment.content = content;
  await comment.save({ validateBeforeSave: true });

  res
    .status(200)
    .json(new ApiResponse(200, comment, "comment updated succesfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
  // TODO: delete a comment
  const { commentId } = req.params;

  if (!commentId) {
    throw new ApiError(400, "comment id is requried");
  }

  const comment = await Comment.findById(commentId);

  if (!comment) {
    throw new ApiError(404, "comment not found");
  }

  console.log(comment.owner, req.user._id);
  const isOwnerValid = comment.owner.toString() === req.user?._id.toString();
  console.log(isOwnerValid);

  if (!isOwnerValid) {
    throw new ApiError(401, "you are not authorized to delete this comment");
  }

  await comment.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };

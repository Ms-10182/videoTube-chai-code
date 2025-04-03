import mongoose, { isValidObjectId, mongo } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";
import { Tweet } from "../models/tweet.model.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  //TODO: toggle like on video
  const isVideoExists = await Video.findById(videoId);

  if (!isVideoExists) {
    throw new ApiError(404, "video not found");
  }
  const likedVideo = await Like.findOneAndDelete({
    likedBy: req.user._id,
    video: new mongoose.Types.ObjectId(videoId),
  });
  if (!likedVideo) {
    const like = await Like.create({
      likedBy: req.user._id,
      video: new mongoose.Types.ObjectId(videoId),
    });

    if (!like) throw new ApiError(500, "failed to add like");
  }
  res
    .status(200)
    .json(new ApiResponse(200, {}, "video like toggled sucessfully"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  //TODO: toggle like on comment

  const isCommentExists = await Comment.findById(commentId);

  if (!isCommentExists) {
    throw new ApiError(404, "comment not found");
  }
  const likedComment = await Like.findOneAndDelete({
    likedBy: req.user._id,
    comment: new mongoose.Types.ObjectId(commentId),
  });
  if (!likedComment) {
    const like = await Like.create({
      likedBy: req.user._id,
      comment: new mongoose.Types.ObjectId(commentId),
    });

    if (!like) throw new ApiError(500, "failed to add like");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "comment like toggled sucessfully"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  //TODO: toggle like on tweet

  if (!tweetId) {
    throw new ApiError(400, "tweet id is required");
  }
  const isTweetExists = await Tweet.findById(tweetId);

  if (!isTweetExists) {
    throw new ApiError(404, "comment not found");
  }
  const tweetComment = await Like.findOneAndDelete({
    likedBy: req.user._id,
    tweet: new mongoose.Types.ObjectId(tweetId),
  });
  if (!tweetComment) {
    const like = await Like.create({
      likedBy: req.user._id,
      tweet: new mongoose.Types.ObjectId(tweetId),
    });

    if (!like) throw new ApiError(500, "failed to add like");
  }

  res
    .status(200)
    .json(new ApiResponse(200, {}, "tweet like toggled sucessfully"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  //TODO: get all liked videos
  if (!req.user) {
    throw new ApiError(400, "you are not authorized");
  }

  const likedVideos = await Like.aggregate([
    {
      $match: { video: { $exists: true }, likedBy: req.user._id }, // Match only likes with a video reference
    },
    {
      $lookup: {
        from: "videos", // Join with the Video collection
        localField: "video",
        foreignField: "_id",
        as: "likedVideos",
      },
    },
    {
      $unwind: "$likedVideos", // Flatten the likedVideos array
    },
    {
      $project: {
        _id: 0, // Exclude the _id field from the result
        likedVideos: 1, // Include only the likedVideos field
      },
    },
  ]);

  if (!likedVideos || likedVideos.length === 0) {
    throw new ApiError(400, "no liked videos");
  }

  res
    .status(200)
    .json(new ApiResponse(200, likedVideos, "fetched all videos successfully"));
});

const getLikedTweets = asyncHandler(async (req, res) => {
  if (!req.user) {
    throw new ApiError(400, "unauthorized access");
  }

  const likedTweets = await Like.aggregate([
    {
      $match: { tweet: { $exists: true }, likedBy: req.user._id },
    },{
      $lookup:{
        from:"tweets",
        localField:"tweet",
        foreignField:"_id",
        as:"likedTweets"
      }
    },
    {
      $unwind:"$likedTweets"
    },
    {
      $project:{
        likedTweets:1,
        _id:0
      }
    }
  ]);

  if(!likedTweets){
    throw new ApiError(500,"failed to fetch liketweets");
  }

  res.status(200).json(new ApiResponse(200,likedTweets,"tweets fetched successfully"))
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos,getLikedTweets };

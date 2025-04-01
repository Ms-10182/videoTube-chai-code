import { Tweet } from "../models/tweet.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  //TODO: create tweet
  let { content } = req.body;

  if (!req.user) {
    throw new ApiError(400, "you are not authorized to create a tweet");
  }
  if (!content) {
    throw new ApiError(400, "content is required");
  }

  content = content.trim();

  const newTweet = await Tweet.create({
    content: content,
    owner: req.user._id,
  });

  if (!newTweet) {
    throw new ApiError(500, "failed to create new tweet");
  }

  res
    .status(200)
    .json(new ApiResponse(200, newTweet, "tweet created sucessfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
  // TODO: get user tweets
  let { page = 1, limit = 10 } = req.query;

  if (isNaN(page) || isNaN(limit)) {
    throw new ApiError(400, "page and limit must be number");
  }
  const options = {
    page: parseInt(page, 10),
    limit: parseInt(limit, 10),
  };

  if (!req.user) {
    throw new ApiError(400, "you are not authorized to get tweets");
  }

  const tweets = await Tweet.paginate({ owner: req.user._id },options);

  if (!tweets) {
    throw new ApiError(500, "failed to fetch tweets");
  }

  res
    .status(200)
    .json(new ApiResponse(200, tweets, "tweets fetched successfully"));
});

const updateTweet = asyncHandler(async (req, res) => {
  //TODO: update tweet
  const { tweetId } = req.params;
  let { content } = req.body;

  if (!req.user) {
    throw new ApiError(400, "you are not authorized");
  }

  if (!tweetId) {
    throw new ApiError(400, "tweet id is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "tweet not found");
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(400, "you are not the owner of this tweet");
  }

  content = content.trim();

  tweet.content = content;
  await tweet.save({ validateBeforeSave: false });

  const updatedTweet = await Tweet.findById(tweetId);
  res
    .status(200)
    .json(new ApiResponse(200, updatedTweet, "tweet updated sucessfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
  //TODO: delete tweet
  const { tweetId } = req.params;

  if (!tweetId) {
    throw new ApiError(400, "tweetId is required");
  }

  const tweet = await Tweet.findById(tweetId);

  if (!tweet) {
    throw new ApiError(404, "tweet not found");
  }

  if (tweet.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not the owner of tweet");
  }

  await tweet.deleteOne();

  res.status(200).json(new ApiResponse(200, {}, "tweet deleted sucessfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };

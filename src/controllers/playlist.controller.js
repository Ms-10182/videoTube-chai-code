import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Video } from "../models/video.model.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!req.user) {
    throw new ApiError(400, "you are not authorized to create a playlist");
  }

  if (!name) {
    throw new ApiError(400, "name is required");
  }

  const playlist = await Playlist.create({
    name: name,
    description: description,
    owner: req.user.id,
  });

  if (!playlist) {
    throw new ApiError(500, "failed to create new playlist");
  }

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist created sucessfully"));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new ApiError(400, "userd id is required");
  }

  const playlists = await Playlist.find({ owner: req.user._id });

  if (!playlists) {
    throw new ApiError(500, "failed to fetch playlist");
  }
  // console.log(playlists)
  res
    .status(200)
    .json(new ApiResponse(200, playlists, "playlists retrived sucessfully"));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  //TODO: get playlist by id
  if (!req.user) {
    throw new ApiError(400, "you are not authorize to acces this playlist");
  }

  if (!playlistId) {
    throw new ApiError(400, "playlist id is required");
  }

  const playlist = await Playlist.findById(playlistId);

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist retrived sucessfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;

  if (!req.user) {
    throw new ApiError(400, "you are not authorized to add video to playlist");
  }

  if (!playlistId || !videoId) {
    throw new ApiError("playlist id and video id both are required");
  }

  if (
    !mongoose.isValidObjectId(playlistId) ||
    !mongoose.isValidObjectId(videoId)
  ) {
    throw new ApiError(400, "Invalid playlist ID or video ID");
  }

  const [video, playlist] = await Promise.all([
    await Video.findById(videoId),
    await Playlist.findById(playlistId),
  ]);

  if (!video) {
    throw new ApiError(404, "video not found");
  }

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not authorized to edit this playlist");
  }

  const isVideoExists = playlist.videos.some(
    (video) => video.toString() === videoId
  );

  let message;
  if (!isVideoExists) {
    playlist.videos.push(video._id);
    await playlist.save({ validateBeforeSave: false });
    message = "video added to playlist successfully";
  } else {
    message = "video already exists";
  }
  res.status(200).json(new ApiResponse(200, playlist, message));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  // TODO: remove video from playlist

  if (!req.user) {
    throw new ApiError(400, "you are not authorized to add video to playlist");
  }

  if (!playlistId || !videoId) {
    throw new ApiError("playlist id and video id both are required");
  }

  if (
    !mongoose.isValidObjectId(playlistId) ||
    !mongoose.isValidObjectId(videoId)
  ) {
    throw new ApiError(400, "Invalid playlist ID or video ID");
  }

  const [video, playlist] = await Promise.all([
    await Video.findById(videoId),
    await Playlist.findById(playlistId),
  ]);

  if (!video) {
    throw new ApiError(404, "video not found");
  }

  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not authorized to edit this playlist");
  }
  const isVideoExists = playlist.videos.some(
    (video) => video.toString() === videoId
  );

  if (!isVideoExists) {
    message = "video doesnt exists, no action needed";
  }

  playlist.videos = playlist.videos.filter(
    (video) => video.toString() !== videoId
  );
  await playlist.save({ validateBeforeSave: false });
  res
    .status(200)
    .json(
      new ApiResponse(200, playlist, "video removed from playlist successfully")
    );
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;

  if (!req.user) {
    throw new ApiError(403, "you are not authorized to delete this playlist");
  }

  if (!playlistId) {
    throw new ApiError(400, "playlist id is required");
  }

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "playlist id is not a valid object id");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "playlist not found");
  }

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not authorized to delete this playlist");
  }

  await playlist.deleteOne();

  res
    .status(200)
    .json(new ApiResponse(200, {}, "playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  //TODO: update playlist

  if ([name, description].some((item) => item.trim() === "")) {
    throw new ApiError("name and description both are required");
  }

  if (!req.user) {
    throw new ApiError(403, "you are not authorized to update this playlist");
  }

  if (!playlistId) {
    throw new ApiError(400, "playlist id is required");
  }

  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "please enter a valid playlist id");
  }

  const playlist = await Playlist.findById(playlistId);

  if (playlist.owner.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "you are not the owner of this playlist");
  }

  playlist.name = name;
  playlist.description = description;
  await playlist.save({ validateBeforeSave: false });

  res
    .status(200)
    .json(new ApiResponse(200, playlist, "playlist updated successfully"));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  deletePlaylist,
  updatePlaylist,
};

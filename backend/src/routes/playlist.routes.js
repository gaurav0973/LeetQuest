import express from "express"
import { isLoggedIn } from "../middleware/auth.middleware.js"
import { addProblemToPlaylist, createPlaylist, deletePlaylist, getAllListDetails, getPlaylistDetails, removeProblemFromPlaylist } from "../controllers/playlist.controllers.js";

const playlistRoutes = express.Router()


playlistRoutes.get("/", isLoggedIn, getAllListDetails);
playlistRoutes.get("/:playlistId", isLoggedIn, getPlaylistDetails);
playlistRoutes.post("/", isLoggedIn, createPlaylist);
playlistRoutes.post("/:playlistId/add-problem", isLoggedIn, addProblemToPlaylist)
playlistRoutes.delete("/:playlistId", isLoggedIn, deletePlaylist)
playlistRoutes.delete("/:playlistId/remove-problem", isLoggedIn,    removeProblemFromPlaylist)

export default playlistRoutes


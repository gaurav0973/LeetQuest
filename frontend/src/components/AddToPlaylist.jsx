import React, { useEffect, useState } from 'react';
import { X, Plus, Loader } from 'lucide-react';
import { usePlaylistStore } from '../store/usePlaylistStore';

const AddToPlaylistModal = ({ isOpen, onClose, problemId }) => {
  const { playlists, getAllPlaylists, addProblemToPlaylist, isLoading } = usePlaylistStore();
  const [selectedPlaylist, setSelectedPlaylist] = useState('');

  useEffect(() => {
    if (isOpen) {
      getAllPlaylists();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedPlaylist) return;

    await addProblemToPlaylist(selectedPlaylist, [problemId]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="rounded-lg shadow-xl w-full max-w-md border"
        style={{ backgroundColor: '#F0FDFD', borderColor: '#B48C8E' }}
      >
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{ borderColor: '#B48C8E' }}
        >
          <h3 className="text-xl font-bold" style={{ color: '#B48C8E' }}>
            Add to Playlist
          </h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-opacity-20"
            style={{ color: '#B48C8E' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium" style={{ color: '#B48C8E' }}>
                Select Playlist
              </span>
            </label>
            <select
              className="select select-bordered w-full"
              value={selectedPlaylist}
              onChange={(e) => setSelectedPlaylist(e.target.value)}
              disabled={isLoading}
              style={{
                borderColor: '#B48C8E',
                color: '#B48C8E',
                backgroundColor: '#ffffff',
              }}
            >
              <option value="">Select a playlist</option>
              {playlists.map((playlist) => (
                <option key={playlist.id} value={playlist.id}>
                  {playlist.name}
                </option>
              ))}
            </select>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn"
              style={{
                border: '1px solid #B48C8E',
                color: '#B48C8E',
                backgroundColor: 'transparent',
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn text-white"
              disabled={!selectedPlaylist || isLoading}
              style={{
                backgroundColor: '#B48C8E',
              }}
            >
              {isLoading ? <Loader className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
              Add to Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddToPlaylistModal;

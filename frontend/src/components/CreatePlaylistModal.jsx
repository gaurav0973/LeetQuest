import React from 'react';
import { useForm } from "react-hook-form";
import { X } from "lucide-react";

const CreatePlaylistModal = ({ isOpen, onClose, onSubmit }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm();

  const handleFormSubmit = async (data) => {
    await onSubmit(data);
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div
        className="rounded-lg shadow-xl w-full max-w-md"
        style={{ backgroundColor: '#F0FDFD', border: '1px solid #B48C8E' }}
      >
        <div
          className="flex justify-between items-center p-4 border-b"
          style={{ borderColor: '#B48C8E' }}
        >
          <h3 className="text-xl font-bold text-[#B48C8E]">Create New Playlist</h3>
          <button
            onClick={onClose}
            className="btn btn-ghost btn-sm btn-circle hover:bg-[#B48C8E22]"
            style={{ color: '#B48C8E' }}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)} className="p-6 space-y-4">
          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-[#B48C8E]">
                Playlist Name
              </span>
            </label>
            <input
              type="text"
              className="input w-full"
              placeholder="Enter playlist name"
              style={{
                border: '1px solid #B48C8E',
                backgroundColor: '#ffffff',
                color: '#B48C8E'
              }}
              {...register('name', { required: 'Playlist name is required' })}
            />
            {errors.name && (
              <label className="label">
                <span className="label-text-alt text-red-500">{errors.name.message}</span>
              </label>
            )}
          </div>

          <div className="form-control">
            <label className="label">
              <span className="label-text font-medium text-[#B48C8E]">
                Description
              </span>
            </label>
            <textarea
              className="textarea h-24"
              placeholder="Enter playlist description"
              style={{
                border: '1px solid #B48C8E',
                backgroundColor: '#ffffff',
                color: '#B48C8E'
              }}
              {...register('description')}
            />
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="btn"
              style={{
                border: '1px solid #B48C8E',
                color: '#B48C8E',
                backgroundColor: 'transparent'
              }}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn text-white"
              style={{ backgroundColor: '#B48C8E' }}
            >
              Create Playlist
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;

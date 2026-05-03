import { useState, useRef } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { userApi } from "@/api/userApi";

interface EditProfileModalProps {
  user: {
    user_id: number;
    user_name: string;
    display_name: string;
    profile_image: string | null;
    cover_image: string | null;
    bio: string | null;
    country: string | null;
  };
  isOpen: boolean;
  onClose: () => void;
  onProfileUpdate: (updatedUser: any) => void;
}

export function EditProfileModal({
  user,
  isOpen,
  onClose,
  onProfileUpdate,
}: EditProfileModalProps) {
  const normalizePreview = (value: string | null): string | undefined => value ?? undefined;
  const [displayName, setDisplayName] = useState(user.display_name);
  const [bio, setBio] = useState(user.bio || "");
  const [country, setCountry] = useState(user.country || "");

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(
    user.profile_image
  );
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(
    user.cover_image
  );

  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const profileInputRef = useRef<HTMLInputElement>(null);
  const coverInputRef = useRef<HTMLInputElement>(null);

  const handleProfileImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoverImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImageFile(file);
      const reader = new FileReader();
      reader.onload = (event) => {
        setCoverImagePreview(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      let updatedProfileImage = profileImagePreview;
      let updatedCoverImage = coverImagePreview;

      // Upload profile image if changed
      if (profileImageFile) {
        const profileResponse = await userApi.updateProfilePic(profileImageFile);
        // Extract filename from response URL and construct API URL
        if (profileResponse.url) {
          const filename = profileResponse.url.split(/[\\/]/).pop();
          updatedProfileImage = `http://localhost:3000/uploads/${filename}`;
        }
      }

      // Upload cover image if changed
      if (coverImageFile) {
        const coverResponse = await userApi.updateCoverImage(coverImageFile);
        // Extract filename from response URL and construct API URL
        if (coverResponse.url) {
          const filename = coverResponse.url.split(/[\\/]/).pop();
          updatedCoverImage = `http://localhost:3000/uploads/${filename}`;
        }
      }

      // Update profile info (display name, bio, country)
      if (
        displayName !== user.display_name ||
        bio !== (user.bio || "") ||
        country !== (user.country || "")
      ) {
        await userApi.updateProfile({
          display_name: displayName,
          bio: bio || undefined,
          country: country || undefined,
        });
      }

      setSuccess("Profile updated successfully!");
      
      // Update parent component with actual server URLs
      onProfileUpdate({
        ...user,
        display_name: displayName,
        bio: bio || null,
        country: country || null,
        profile_image: updatedProfileImage,
        cover_image: updatedCoverImage,
      });

      // Close modal after success
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const initials = (displayName || user.user_name || "?")[0].toUpperCase();

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop itself, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in"
    >
      <div className="w-full max-w-2xl max-h-[90vh] bg-white rounded-2xl border-2 border-black shadow-2xl overflow-hidden flex flex-col animate-in scale-in-95">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b-2 border-black px-6 py-4 flex justify-between items-center">
          <h2 className="font-black text-lg uppercase tracking-wider">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-all duration-200 hover:scale-110 active:scale-95"
          >
            <X size={24} className="font-bold" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Cover Image */}
            <div>
              <label className="font-black uppercase text-sm mb-2 block">
                Cover Image
              </label>
              <div
                onClick={() => coverInputRef.current?.click()}
                className="relative h-40 bg-gradient-to-r from-purple-300 via-blue-300 to-pink-300 rounded-xl border-2 border-black cursor-pointer hover:opacity-80 transition-opacity duration-200 overflow-hidden group"
              >
                {coverImagePreview && (
                  <img
                    src={normalizePreview(coverImagePreview)}
                    alt="cover preview"
                    className="w-full h-full object-cover"
                  />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-all duration-200 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-2">
                    <Upload size={32} className="text-white" />
                    <span className="text-white font-bold text-sm">
                      Upload Cover
                    </span>
                  </div>
                </div>
              </div>
              <input
                ref={coverInputRef}
                type="file"
                accept="image/*"
                onChange={handleCoverImageSelect}
                className="hidden"
              />
            </div>

            {/* Profile Image */}
            <div>
              <label className="font-black uppercase text-sm mb-2 block">
                Profile Picture
              </label>
              <div className="flex gap-4 items-start">
                <div
                  onClick={() => profileInputRef.current?.click()}
                  className="relative cursor-pointer"
                >
                  <Avatar className="w-24 h-24 border-4 border-black shrink-0 group/avatar">
                    {profileImagePreview && (
                      <AvatarImage
                        src={normalizePreview(profileImagePreview)}
                        alt="profile preview"
                      />
                    )}
                    <AvatarFallback className="font-black text-2xl bg-purple-200">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-all duration-200 flex items-center justify-center cursor-pointer">
                    <Upload size={20} className="text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="text-xs text-gray-500 font-bold mb-2">
                    Click avatar to upload a profile picture (JPG, PNG, GIF)
                  </p>
                  {profileImageFile && (
                    <div className="text-xs font-bold text-green-600">
                      ✓ {profileImageFile.name}
                    </div>
                  )}
                </div>
              </div>
              <input
                ref={profileInputRef}
                type="file"
                accept="image/*"
                onChange={handleProfileImageSelect}
                className="hidden"
              />
            </div>

            {/* Display Name */}
            <div>
              <label className="font-black uppercase text-sm mb-2 block">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
                className="w-full border-2 border-black rounded-lg p-3 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                placeholder="Your display name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="font-black uppercase text-sm mb-2 block">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                className="w-full border-2 border-black rounded-lg p-3 font-bold resize-none focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                placeholder="Tell everyone about yourself"
              />
              <p className="text-xs text-gray-500 font-bold mt-1">
                {bio.length}/160
              </p>
            </div>

            {/* Country */}
            <div>
              <label className="font-black uppercase text-sm mb-2 block">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                maxLength={50}
                className="w-full border-2 border-black rounded-lg p-3 font-bold focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
                placeholder="Your country"
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="bg-red-50 border-2 border-red-500 rounded-lg p-3">
                <p className="text-red-600 font-bold text-sm">{error}</p>
              </div>
            )}

            {success && (
              <div className="bg-green-50 border-2 border-green-500 rounded-lg p-3">
                <p className="text-green-600 font-bold text-sm">{success}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4 border-t-2 border-black">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 border-2 border-black rounded-lg font-black uppercase text-sm hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-3 bg-black text-white border-2 border-black rounded-lg font-black uppercase text-sm hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

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
      className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/40 p-4 backdrop-blur-sm animate-in fade-in"
    >
      <div className="flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl border border-neutral-200 bg-white shadow-2xl animate-in scale-in-95">
        <div className="sticky top-0 flex items-center justify-between border-b border-neutral-200 bg-white px-6 py-4">
          <h2 className="text-lg font-semibold tracking-tight text-neutral-950">
            Edit Profile
          </h2>
          <button
            onClick={onClose}
            className="rounded-full p-2 transition-colors hover:bg-neutral-100"
          >
            <X size={24} className="font-bold" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto flex-1 scrollbar-hide">
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Cover Image */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Cover Image
              </label>
              <div
                onClick={() => coverInputRef.current?.click()}
                className="group relative h-40 cursor-pointer overflow-hidden rounded-2xl border border-neutral-200 bg-neutral-100 transition-opacity hover:opacity-90"
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
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Profile Picture
              </label>
              <div className="flex gap-4 items-start">
                <div
                  onClick={() => profileInputRef.current?.click()}
                  className="relative cursor-pointer"
                >
                  <Avatar className="h-24 w-24 shrink-0 border-4 border-white shadow-sm">
                    {profileImagePreview && (
                      <AvatarImage
                        src={normalizePreview(profileImagePreview)}
                        alt="profile preview"
                      />
                    )}
                    <AvatarFallback className="text-2xl">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 hover:opacity-100 transition-all duration-200 flex items-center justify-center cursor-pointer">
                    <Upload size={20} className="text-white" />
                  </div>
                </div>

                <div className="flex-1">
                  <p className="mb-2 text-xs text-neutral-500">
                    Click avatar to upload a profile picture (JPG, PNG, GIF)
                  </p>
                  {profileImageFile && (
                    <div className="text-xs font-medium text-green-600">
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
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={50}
                className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm focus:outline-none focus:ring-4 focus:ring-neutral-950/5"
                placeholder="Your display name"
              />
            </div>

            {/* Bio */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Bio
              </label>
              <textarea
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                maxLength={160}
                rows={3}
                className="w-full resize-none rounded-xl border border-neutral-200 bg-white p-3 text-sm focus:outline-none focus:ring-4 focus:ring-neutral-950/5"
                placeholder="Tell everyone about yourself"
              />
              <p className="mt-1 text-xs text-neutral-500">
                {bio.length}/160
              </p>
            </div>

            {/* Country */}
            <div>
              <label className="mb-2 block text-sm font-medium text-neutral-700">
                Country
              </label>
              <input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                maxLength={50}
                className="w-full rounded-xl border border-neutral-200 bg-white p-3 text-sm focus:outline-none focus:ring-4 focus:ring-neutral-950/5"
                placeholder="Your country"
              />
            </div>

            {/* Messages */}
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 p-3">
                <p className="text-sm font-medium text-red-600">{error}</p>
              </div>
            )}

            {success && (
              <div className="rounded-xl border border-green-200 bg-green-50 p-3">
                <p className="text-sm font-medium text-green-600">{success}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 border-t border-neutral-100 pt-4">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="flex-1 rounded-full border border-neutral-200 px-4 py-3 text-sm font-semibold transition-colors hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex flex-1 items-center justify-center gap-2 rounded-full border border-neutral-950 bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-50"
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

import { useEffect, useState } from "react";
import { userApi } from "@/api/userApi";
import { useAuth } from "@/context/AuthContext";
import { UserCard } from "./UserCard";
import { Input } from "./ui/input";
import { Search } from "lucide-react";

interface SuggestedUser {
  user_id: number;
  user_name: string;
  display_name: string;
  profile_image?: string | null;
  bio?: string | null;
}

export function RightPanel() {
  const { user } = useAuth();
  const [users, setUsers] = useState<SuggestedUser[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const normalizedQuery = search.trim().toLowerCase();
  const isSearching = normalizedQuery.length > 0;
  const visibleUsers = users.filter((candidate) => {
    if (!isSearching) {
      return !followingIds.has(candidate.user_id);
    }

    const displayName = candidate.display_name?.toLowerCase() ?? "";
    const userName = candidate.user_name?.toLowerCase() ?? "";
    const bio = candidate.bio?.toLowerCase() ?? "";

    return (
      displayName.includes(normalizedQuery) ||
      userName.includes(normalizedQuery) ||
      bio.includes(normalizedQuery)
    );
  });

  useEffect(() => {
    const fetchSuggestedUsers = async () => {
      try {
        setLoading(true);
        const [allUsersResponse, followingResponse] = await Promise.all([
          userApi.getAllUsers(),
          user ? userApi.getFollowing(user.user_id) : Promise.resolve([]),
        ]);

        const allUsers = Array.isArray(allUsersResponse?.result)
          ? allUsersResponse.result
          : [];
        const following = Array.isArray(followingResponse) ? followingResponse : [];
        const nextFollowingIds = new Set<number>(
          following.map((followedUser: SuggestedUser) => followedUser.user_id),
        );

        setUsers(
          allUsers.filter(
            (candidate: SuggestedUser) => candidate.user_id !== user?.user_id,
          ),
        );
        setFollowingIds(nextFollowingIds);
      } catch (error) {
        console.error("Failed to fetch suggested users:", error);
        setUsers([]);
        setFollowingIds(new Set());
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestedUsers();
  }, [user]);

  const handleFollowedUser = (userId: number, isFollowing: boolean) => {
    setFollowingIds((currentIds) => {
      const nextIds = new Set(currentIds);

      if (isFollowing) {
        nextIds.add(userId);
      } else {
        nextIds.delete(userId);
      }

      return nextIds;
    });
  };

  return (
    <aside className="sticky top-0 h-screen space-y-4 overflow-y-auto bg-neutral-50 p-4">
      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <Input
          placeholder="Search users"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          className="pl-9"
        />
      </div>
      <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm">
        <h2 className="mb-4 text-base font-semibold text-neutral-950">
          {isSearching ? "Search results" : "Who to follow"}
        </h2>
        <div className="space-y-3">
          {loading && (
            <p className="text-sm font-bold text-gray-500">Loading users...</p>
          )}
          {!loading && visibleUsers.length === 0 && (
            <p className="text-sm font-bold text-gray-500">
              {isSearching ? "No users found." : "No unfollowed users found."}
            </p>
          )}
          {!loading &&
            visibleUsers.map((candidate) => (
              <UserCard
                key={`${candidate.user_id}-${followingIds.has(candidate.user_id)}`}
                user_id={candidate.user_id}
                user_name={candidate.user_name}
                display_name={candidate.display_name}
                profile_image={candidate.profile_image}
                bio={candidate.bio ?? undefined}
                isFollowing={followingIds.has(candidate.user_id)}
                onFollowChange={(isFollowing) =>
                  handleFollowedUser(candidate.user_id, isFollowing)
                }
              />
            ))}
        </div>
      </section>
    </aside>
  );
}

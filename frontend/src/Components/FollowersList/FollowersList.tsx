import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import PlaceHolderImg from "../../assets/avatar-placeholder.png";
import FollowHook from "../../Hooks/FollowHook";


interface User {
  _id: string;
  fullName: string;
  username: string;
  profileImg?: string;
}

interface FollowersListProps {
  userIds: string[];
}

const FollowersList = ({ userIds }: FollowersListProps) => {
  const { followUser, isPending } = FollowHook();
  
  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["usersList", userIds],
    queryFn: async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/getUsersByIds`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userIds }),
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to fetch users");
        }

        return data;
      } catch (error) {
        console.error("Error fetching users:", error);
        return [];
      }
    },
  });

  if (isLoading) {
    return <div className="flex justify-center p-4">Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {users?.map((user) => (
        <div key={user._id} className="flex items-center justify-between">
          <Link to={`/profile/${user.username}`} className="flex items-center gap-2">
            <div className="avatar">
              <div className="w-10 rounded-full">
                <img src={user.profileImg || PlaceHolderImg} alt={user.username} />
              </div>
            </div>
            <div>
              <p className="font-bold">{user.fullName}</p>
              <p className="text-sm text-gray-500">@{user.username}</p>
            </div>
          </Link>
          <button
            className="btn btn-outline btn-xs rounded-full"
            onClick={() => followUser(user._id)}
          >
            {isPending ? "..." : "Follow"}
          </button>
        </div>
      ))}
    </div>
  );
};

export default FollowersList;
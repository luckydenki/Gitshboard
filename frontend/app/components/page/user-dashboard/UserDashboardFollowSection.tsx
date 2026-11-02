import { FiUserPlus, FiUsers } from "react-icons/fi";

interface UserDashboardFollowSectionProps {
    following: number;
    followers: number;
}

export default function UserDashboardFollowSection({
    following,
    followers,
}: UserDashboardFollowSectionProps) {
    return (
        <dl className="flex flex-wrap gap-4 border-t border-gray-300 pt-5">
            <div className="flex min-w-28 flex-1 flex-col gap-2 p-2">
                <dt className="flex items-center gap-2 text-xs text-gray-500">
                    <FiUserPlus aria-hidden="true" />
                    팔로잉
                </dt>
                <dd className="text-xl font-bold">{following.toLocaleString()}</dd>
            </div>
            <div className="flex min-w-28 flex-1 flex-col gap-2 p-2">
                <dt className="flex items-center gap-2 text-xs text-gray-500">
                    <FiUsers aria-hidden="true" />
                    팔로워
                </dt>
                <dd className="text-xl font-bold">{followers.toLocaleString()}</dd>
            </div>
        </dl>
    );
}

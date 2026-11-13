import { FiUserPlus, FiUsers } from "react-icons/fi";
import { AccountStats } from "~/components/compound/AccountStats";

interface UserDashboardFollowSectionProps {
    following: number;
    followers: number;
}

export default function UserDashboardFollowSection({
    following,
    followers,
}: UserDashboardFollowSectionProps) {
    return (
        <AccountStats>
            <AccountStats.Item
                icon={FiUserPlus}
                label="팔로잉"
                value={following.toLocaleString()}
            />
            <AccountStats.Item
                icon={FiUsers}
                label="팔로워"
                value={followers.toLocaleString()}
            />
        </AccountStats>
    );
}

import { FiUserPlus } from "react-icons/fi";
import { AccountStats } from "~/components/compound/AccountStats";

interface OrgDashboardCountSectionProps {
    memberCount: number;
}

export default function OrgDashboardCountSection({ memberCount }: OrgDashboardCountSectionProps) {
    return (
        <AccountStats>
            <AccountStats.Item
                icon={FiUserPlus}
                label="팔로잉"
                value={memberCount}
            />
        </AccountStats>
    );
}

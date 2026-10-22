interface DashboardFollowSectionProps {
    following: number;
    followers: number;
}

export default function DashboardFollowSection({
    following,
    followers,
}: DashboardFollowSectionProps) {
    return (
        <section className="flex gap-4">
            <div className="h-fit w-24 py-2 text-lg not-lg:w-full">
                팔로잉 <span>{following}</span>
            </div>
            <div className="h-fit w-24 py-2 text-lg not-lg:w-full">
                팔로워 <span>{followers}</span>
            </div>
        </section>
    );
}

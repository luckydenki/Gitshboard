import { Github } from "~/icons/Github";

export function Loading() {
    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-950">
            <div className="flex flex-col items-center gap-4">
                <div className="invert">
                    <Github
                        width={48}
                        height={48}
                    />
                </div>
                <p className="animate-pulse text-sm text-gray-400">Loading...</p>
            </div>
        </div>
    );
}

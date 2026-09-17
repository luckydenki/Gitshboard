export default function MovingStrip() {
    return (
        <div className="absolute top-1/2 left-1/2 z-15 flex h-full w-full flex-col gap-64 text-2xl text-gray-800 opacity-30 dark:text-white">
            <div className="flex h-10 w-full -translate-x-1/2 -translate-y-1/2 rotate-45 flex-row gap-64">
                <div className="loop-anim absolute flex flex-row items-center gap-64">
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                </div>
                <div className="loop-copy-anim absolute flex flex-row items-center gap-64">
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                    <div className="bg-github-light h-8 w-48 rounded-lg"></div>
                </div>
            </div>
        </div>
    );
}

export default function UpcomingBackdrop() {
    return (
        <div className="bg-panel relative isolate flex min-h-24 w-full flex-1 overflow-hidden rounded-lg">
            <div
                aria-hidden="true"
                className="flex w-full flex-col justify-center gap-3 p-4 opacity-40">
                <div className="h-3 w-2/3 rounded-lg bg-gray-200" />
                <div className="h-3 w-full rounded-lg bg-gray-200" />
                <div className="h-3 w-1/2 rounded-lg bg-gray-200" />
            </div>
            <div className="bg-panel/70 absolute inset-0 flex items-center justify-center p-4 backdrop-blur-sm">
                <p className="text-center text-sm font-medium text-gray-500">추후 업데이트 예정</p>
            </div>
        </div>
    );
}

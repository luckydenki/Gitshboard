import { BiStar } from "react-icons/bi";

export interface RepositoryItems {
    name: string;
    stars: number;
    languages: string;
    lateUpdate: string;
}

export interface DashboardRepositorySectionProps {
    repos: Array<RepositoryItems>;
}

export default function DashboardRepositorySection({ repos }: DashboardRepositorySectionProps) {
    return (
        <section className="min-h-[50vh]">
            <div className="grid grid-cols-3 gap-4 pb-8">
                <div className="bg-panel rounded-lg p-2">총 레포 수</div>
                <div className="bg-panel rounded-lg p-2">받은 star 수</div>
                <div className="bg-panel rounded-lg p-2">포크 수</div>
            </div>
            <h3 className="mb-4 text-xl">레포지토리</h3>
            <ul>
                {repos.map((repo) => {
                    return (
                        <li className="bg-panel hover:outline-primary grid min-h-28 grid-cols-[minmax(0,1fr)_200px] rounded-lg px-4 py-2 hover:outline">
                            <div className="flex flex-col gap-3 py-2">
                                <a
                                    href="#"
                                    className="text-xl">
                                    {repo.name}
                                </a>
                                <div className="flex gap-3">
                                    <span className="flex items-center">
                                        <BiStar
                                            aria-label="star"
                                            className="inline"
                                        />
                                        {repo.stars}
                                    </span>
                                    {repo.languages}
                                </div>
                                <div className="text-sm text-gray-500">
                                    최근 업데이트 : {repo.lateUpdate}
                                </div>
                            </div>
                            <div className="">
                                <a href="#">깃 허브</a>
                                <div className="bg-gray-300">활동량 요약</div>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}

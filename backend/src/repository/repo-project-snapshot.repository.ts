import { redisClient } from "../infra/redis/redisClient";

class RepoProjectSnapshotRepository {
    private key(repositoryId: string, isPublic: boolean, month: string) {
        return `gitshboard:repo-project:disk:${isPublic ? "public" : "restricted"}:${repositoryId}:${month}`;
    }

    /** 월별 실제 Git 용량 관측값을 기록합니다. */
    public async recordDiskUsage(repositoryId: string, isPublic: boolean, month: string, sizeKb: number) {
        if (!redisClient.isReady) return;
        try {
            // Record the first observation in a month consistently across concurrent requests.
            await redisClient.set(this.key(repositoryId, isPublic, month), String(sizeKb), {
                NX: true,
                EX: 7 * 31 * 24 * 60 * 60,
            });
        } catch (error) {
            console.warn("저장소 용량 관측값 저장 실패", error);
        }
    }

    /** 조회 가능한 월별 실제 Git 용량 관측값을 읽습니다. */
    public async readDiskUsage(repositoryId: string, isPublic: boolean, months: string[]): Promise<Array<number | null>> {
        if (!redisClient.isReady) return months.map(() => null);
        try {
            const values = await Promise.all(months.map((month) => redisClient.get(this.key(repositoryId, isPublic, month))));
            return values.map((value) => value == null ? null : Number(value));
        } catch (error) {
            console.warn("저장소 용량 관측값 조회 실패", error);
            return months.map(() => null);
        }
    }
}

export default new RepoProjectSnapshotRepository();

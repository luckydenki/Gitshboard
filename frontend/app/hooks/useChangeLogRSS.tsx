import { useQuery } from "@tanstack/react-query";

export default function useChangeLogRSS() {
    const getChangelogRSS = async () => {
        try {
            const res = await fetch("/api/githubblog/changelog");

            const json = await res.json();
            if (!res.ok) {
                throw json;
            }

            return json.data;
        } catch (e) {
            console.error("error :", e);
        }
    };

    const { data, isLoading, isError, error } = useQuery({
        queryKey: ["changelogRSS"],
        queryFn: getChangelogRSS,
        staleTime: 5 * 60 * 1000,
    });

    console.log("data", data);

    return { data, isLoading, isError, error };
}

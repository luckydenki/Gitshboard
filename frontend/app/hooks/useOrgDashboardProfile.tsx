import { useQuery } from "@tanstack/react-query";

export default function useOrgDashboardProfile(login?: string) {
    const { data, isLoading, isError } = useQuery({
        queryKey: ["org-profile"],
        queryFn: () => {
            return "a";
        },
    });

    return { data, isLoading, isError };
}

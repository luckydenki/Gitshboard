//Compound pattern
//만약 성질이 매우 비슷하거나 응집도가 엄청 높은 컴포넌트들이 있다면

import type { IconType } from "react-icons";

export const AccountStatsLayout = ({ children }: { children: React.ReactNode }) => {
    return <dl className="flex flex-wrap gap-4 border-t border-gray-300 pt-5">{children}</dl>;
};

export interface AccountStatsItemProps {
    icon: IconType;
    label: string;
    value: string | number;
}
export const AccountStatsItem = ({
    icon: Icon,
    label,
    value,
}: AccountStatsItemProps) => {
    return (
        <div className="flex min-w-28 flex-1 flex-col gap-2 p-2">
            <dt className="flex items-center gap-2 text-xs text-gray-500">
                <Icon aria-hidden="true" />
                {label}
            </dt>
            <dd className="text-xl font-bold">{value}</dd>
        </div>
    );
};

//그것들이 하나의 묶음으로서 쓰인다는 것을 만들기 위해 이렇게 사용하기도 함
export const AccountStats = Object.assign(AccountStatsLayout, {
    Item: AccountStatsItem,
});

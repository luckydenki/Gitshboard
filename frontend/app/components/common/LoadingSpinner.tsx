import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { tv, type VariantProps } from "tailwind-variants";

const loadingSpinnerTV = tv({
    slots: {
        root: "inline-flex min-w-0 items-center gap-2 align-middle",
        icon: "text-primary shrink-0 animate-spin motion-reduce:animate-none",
        label: "text-sm text-gray-500",
    },
    variants: {
        size: { sm: { icon: "size-4" }, md: { icon: "size-6" }, lg: { icon: "size-8" } },
        showLabel: { true: { label: "break-words" }, false: { label: "sr-only" } },
    },
    defaultVariants: { size: "md", showLabel: false },
});

type Props = VariantProps<typeof loadingSpinnerTV> & {
    label?: string;
    className?: string;
};

export default function LoadingSpinner({ size, showLabel, label = "로딩 중", className }: Props) {
    const styles = loadingSpinnerTV({ size, showLabel });
    return (
        <span
            role="status"
            className={styles.root({ className })}>
            <AiOutlineLoading3Quarters
                aria-hidden="true"
                focusable="false"
                className={styles.icon()}
            />
            <span className={styles.label()}>{label}</span>
        </span>
    );
}

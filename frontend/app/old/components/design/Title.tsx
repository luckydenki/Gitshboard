import { tv, type VariantProps } from "tailwind-variants";

const title_tv = tv({
    variants: {
        variant: {
            sm: "text-2xl font-bold text-gray-500 not-sm:hidden dark:text-gray-400",
            lg: "text-8xl font-bold text-gray-500 dark:text-gray-400",
        },
    },
    defaultVariants: {
        variant: "sm",
    },
});

interface TitleProps extends VariantProps<typeof title_tv> {}

export default function Title({ variant }: TitleProps) {
    return (
        <span className={title_tv({ variant })}>
            <span>Git</span>
            <span className="text-github-light">sh</span>
            <span>board</span>
        </span>
    );
}

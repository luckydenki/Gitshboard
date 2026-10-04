import { tv, type VariantProps } from "tailwind-variants";

const logo_tv = tv({
    variants: {
        variant: {
            sm: "w-10 min-w-10 not-sm:hidden",
            lg: "w-32 min-w-10",
        },
    },
    defaultVariants: {
        variant: "sm",
    },
});

interface Logo extends VariantProps<typeof logo_tv> {
    className?: string;
}

export default function Logo({ variant, className }: Logo) {
    const clsName = logo_tv({ variant }) + " " + className;

    return (
        <img
            src="/Gitshboard_alpha.png"
            alt="Gitshboard Logo"
            className={clsName}
            aria-label="메인 로고"
        />
    );
}

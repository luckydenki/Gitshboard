import { TfiEmail } from "react-icons/tfi";

export default function CommonFooter() {
    return (
        <footer
            className={
                "bg-panel after:border-back relative flex h-36 flex-col items-center justify-center gap-2 py-12 font-medium [grid-area:footer] after:absolute after:top-0 after:left-[calc(50%-72px)] after:w-36 after:rounded-b-full after:border-t-8 after:content-['']"
            }>
            <div>Copyright © 2026 Gitshboard. All rights reserved.</div>

            <div>
                <a href="#">개인정보처리방침</a> |
                <a href="mailto:info@gitshboard.com">
                    &nbsp;
                    <TfiEmail className="inline" /> 이메일
                </a>
            </div>
            <div>Gitshboard</div>
        </footer>
    );
}

import { SiGithub } from "@icons-pack/react-simple-icons";

export default function HeaderLoginButton() {
    return (
        <button
            className={`hover:ring-primary bg-github-black flex gap-2 rounded-full px-4 py-2 text-white not-lg:p-1 hover:cursor-pointer hover:ring-2`}
            aria-label="깃허브 Oauth 로그인 버튼">
            <SiGithub />
            <span className="not-lg:hidden">깃허브 로그인</span>
        </button>
    );
}

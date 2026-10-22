export default function MainLogo() {
    return (
        <>
            <img
                src="/SVGLogo.svg"
                alt="로고"
                className="size-64 not-sm:hidden"
            />
            <span className="mb-6 text-6xl font-bold sm:hidden">
                Git<span className="text-primary">sh</span>board
            </span>
        </>
    );
}

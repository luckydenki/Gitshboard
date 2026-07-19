



export default function TitleLogo(){


    return(
        <div className="flex flex-row items-center gap-4 not-sm:gap-0">
            <img src="/Gitshboard_alpha.png" alt="Gitshboard Logo" className="animate-bounce-slow w-32 not-sm:hidden" />
            <h1 className="text-7xl not-sm:text-5xl font-semibold tracking-wide text-gray-950 dark:text-white ">
              <span>Git</span>
              <span className="text-github-light">sh</span>
              <span>board</span>
            </h1>
        </div>
    )
}
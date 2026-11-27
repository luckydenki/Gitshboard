import { useState } from "react";
import { CiDark, CiLight } from "react-icons/ci";

export default function HeaderDarkModeButton() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    return (
        <button
            type="button"
            aria-label={isDarkMode ? "밝은 모드로 전환" : "어두운 모드로 전환"}
            className="flex size-8 cursor-pointer items-center justify-center"
            onClick={() => setIsDarkMode(!isDarkMode)}>
            {isDarkMode ? (
                <CiLight size={32} />
            ) : (
                <CiDark
                    size={32}
                    color="black"
                />
            )}
        </button>
    );
}

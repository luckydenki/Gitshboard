import { useState } from "react";
import { CiDark, CiLight } from "react-icons/ci";

export default function HeaderDarkModeButton() {
    const [isDarkMode, setIsDarkMode] = useState(false);
    return (
        <button
            className="flex size-8 items-center justify-center"
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

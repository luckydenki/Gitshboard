import CommonError from "../utils/common-error";

const escapeXml = (value: string) => value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&apos;");

const wrapText = (value: string, maxCharacters: number) => {
    const words = value.trim().split(/\s+/);
    const lines: string[] = [];
    let currentLine = "";

    for (const word of words) {
        const nextLine = currentLine ? `${currentLine} ${word}` : word;

        if (nextLine.length > maxCharacters && currentLine) {
            lines.push(currentLine);
            currentLine = word;
        } else {
            currentLine = nextLine;
        }
    }

    if (currentLine) {
        lines.push(currentLine);
    }

    return lines.slice(0, 3);
};

/** Returns a readable SVG error card for README image endpoints. */
export default function ErrorSVG(error: CommonError, width: number, height: number): string {
    const padding = 32;
    const cardWidth = Math.max(0, width - (padding * 2));
    const cardHeight = Math.max(0, height - (padding * 2));
    const isBadRequest = error.status === 400;
    const title = error.title || (isBadRequest ? "Invalid request parameters" : "Unable to generate this chart");
    const detail = error.detail || (isBadRequest
        ? "Check the required parameter values and request the SVG again."
        : "Please try again in a moment.");
    const detailLines = wrapText(detail, Math.max(28, Math.floor((cardWidth - 112) / 7.5)));
    const detailMarkup = detailLines
        .map((line, index) => `<tspan x="${padding + 44}" dy="${index === 0 ? 0 : 24}">${escapeXml(line)}</tspan>`)
        .join("");
    const helperText = isBadRequest
        ? "Review the query parameters and their expected values, then try again."
        : "The request could not be completed. Try again after checking the request details.";

    return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="error-title error-description">
    <title id="error-title">${escapeXml(title)}</title>
    <desc id="error-description">${escapeXml(detail)}</desc>
    <rect width="${width}" height="${height}" fill="#0d1117"/>
    <rect x="${padding}" y="${padding}" width="${cardWidth}" height="${cardHeight}" rx="16" fill="#161b22" stroke="#30363d"/>
    <rect x="${padding}" y="${padding}" width="5" height="${cardHeight}" rx="2.5" fill="#f85149"/>

    <circle cx="${padding + 48}" cy="${padding + 54}" r="20" fill="#da3633"/>
    <path d="M${padding + 48} ${padding + 41}v15M${padding + 48} ${padding + 64}v1" stroke="#ffffff" stroke-width="3" stroke-linecap="round"/>

    <text x="${padding + 84}" y="${padding + 43}" fill="#8b949e" font-family="Arial, sans-serif" font-size="12" font-weight="700" letter-spacing="1.2">REQUEST ERROR</text>
    <text x="${padding + 84}" y="${padding + 68}" fill="#f0f6fc" font-family="Arial, sans-serif" font-size="22" font-weight="700">${escapeXml(title)}</text>

    <rect x="${width - padding - 102}" y="${padding + 30}" width="70" height="28" rx="14" fill="#3d1d1d" stroke="#f85149" stroke-opacity="0.45"/>
    <text x="${width - padding - 67}" y="${padding + 49}" fill="#ff7b72" font-family="Arial, sans-serif" font-size="12" font-weight="700" text-anchor="middle">HTTP ${error.status}</text>

    <line x1="${padding + 44}" x2="${width - padding - 44}" y1="${padding + 106}" y2="${padding + 106}" stroke="#30363d"/>
    <text x="${padding + 44}" y="${padding + 142}" fill="#c9d1d9" font-family="Arial, sans-serif" font-size="15">${detailMarkup}</text>

    <rect x="${padding + 44}" y="${height - padding - 73}" width="${Math.max(0, cardWidth - 88)}" height="41" rx="8" fill="#0d1117"/>
    <text x="${padding + 60}" y="${height - padding - 47}" fill="#8b949e" font-family="Arial, sans-serif" font-size="12">${escapeXml(helperText)}</text>
</svg>`;
}

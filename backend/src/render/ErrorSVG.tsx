import CommonError from "../utils/common-error";



/*
    잘못된 요청에 대한 SVG를 반환하는 컴포넌트

*/
export default function ErrorSVG(error : CommonError, width: number, height: number): string {

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
        <rect width="${width}" height="${height}" fill="#f8d7da"/>
        <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" font-size="20" fill="#721c24">
            Error: ${error.detail}
        </text>
    </svg>
    `;
    return svg;
}

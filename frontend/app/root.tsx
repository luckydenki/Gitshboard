import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useNavigate,
} from "react-router";
import { QueryCache, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useRef, useState } from "react";

import type { Route } from "./+types/root";
import "./app.css";


/**
 * 글로벌 스타일과 폰트를 설정하는 링크를 반환하는 함수입니다.
 * @returns 
 */
export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  // preconnect : 브라우저에게 특정 도메인과의 연결을 미리 설정하도록 지시하는 링크 관계입니다. 
  // 이를 통해 브라우저는 해당 도메인에 대한 DNS 조회, TCP 핸드셰이크, TLS 협상 등을 미리 수행하여 
  // 실제 요청 시 지연 시간을 줄일 수 있습니다.
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];

// React-router는 links를 export 시키면 자동으로 head에 link를 추가해줍니다.
// 따라서 글로벌 스타일과 폰트를 설정하는 링크를 반환하는 함수를 export 시켜야함.
// 배열 안의 객체 하나하나가 <link> 태그의 속성으로 변환되어 head에 추가됩니다.

export const meta: Route.MetaFunction = () => [
  { title : "React-Github"  },
  { name : "description", content : "React-Github is a web application that provides GitHub repository statistics and insights." },
];




/**
 * 전역 레이아웃 컴포넌트입니다.
 * @param param0 
 * @returns 
 */
export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

//Outlet은 현재 라우트의 자식 라우트를 렌더링하는 컴포넌트.
//루트 레벨에서는 자식 라우트를 렌더링하기 위해 Outlet을 사용함.
export default function App() {
  const navigate = useNavigate();
  const handle_401_Ref = useRef(false);


  const [queryClient] = useState(()=>new QueryClient({
    queryCache : new QueryCache({

      onError : (error : any)=>{
        if('status' in error){

          //401 에러이면서 현재 위치가 home 화면만 아니면 됨
            if( error.status  === 401 && window.location.pathname !== "/" && !handle_401_Ref.current){
              handle_401_Ref.current = true;
              alert("로그인 해주세요.");
              navigate("/", { replace : true });
            }
        }
      }

    })

  })); //이렇게 하면 컴포넌트가 처음 렌더링 될 때 한 번만 생성되고 이후에는 같은 인스턴스를 사용합니다.
  



  return (
        <QueryClientProvider client={queryClient}>
          <Outlet />
        </QueryClientProvider>

  );
}

/**
 * 루트 레벨에서의 에러를 처리하는 컴포넌트입니다.
 * @param param0 
 * @returns 
 */
export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } 
  else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}

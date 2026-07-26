
# Frontend Convention

## 페이지 컴포넌트 규칙

1. 페이지 렌더링을 바꾸는 상태 (useState)는 페이지에서 관리함
2. 그 외 useQuery, useMemo, useEffect 등은 hooks에서 관리함
3. 의사 결정 로직, 선언적 로직들을 제외한 보여져야 할 UI는 components에서 관리함

```tsx
 { isloading ? <LoadingSkeleton /> : <DataComponent data={data} /> }
```

이런 isloading, isError 같은 ui 상태를 제어하는 것들은 페이지 내에서 관리하고 따로 컴포넌트화 시키지 말것.

4. 페이지 컴포넌트의 파일명은 소문자와 스네이크-케이스로 작성함.


## tailwind 규칙

긴 tailwind 에 대해 다음과 같은 순서로 `{""}` 로 작성할 것.

 1. 요소가 놓일 포지션 위치와 관련된 클래스

```
 ex) flex, grid, absolute, top-0, left-0, items-center, gap
```

2. 요소의 크기와 관련된 클래스

 ```
 ex) w-1/2, h-12, min-w-md, max-w-4xl, p-6, m-4
```

3. 배경, 테두리, 그림자 관련 클래스

```
 ex) bg-gray-300, bg-white, border, border-gray-300, shadow-md
```

4. 글자, 폰트 관련 클래스

 ```
 ex) text-sm, text-lg, font-bold, font-medium, font-light...
 ```

5. 상태 관련 클래스

 ```
ex) hover:bg-gray-200, focus:outline-none, active:ring-2... * 
 ```

6. 반응형 관련 클래스

```
* ex) sm:text-sm, md:text-lg, lg:text-xl, not-sm:text-sm, not-md:text-lg.. 
```

7. animation, transition 관련 클래스, 만약 css로 직접 만든 애니메이션이 있다면 여기에 작성.

```
ex) animate-pulse, transition-all, duration-200, ease-in-out...
```

8. 그외 기타 커스텀 css, 또는 위에 해당하지 않는 모든 클래스

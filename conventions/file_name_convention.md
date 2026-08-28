# 파일명 컨벤션

## 폴더 이름
- 케밥 케이스로 작성 

```
my-folder
```

## 컴포넌트

- 일반 컴포넌트는 파스칼로 작성

```
ex) ItemList.tsx
```

- 레이아웃 컴포넌트도 파스칼로 작성하나 접미사로 반드시 Layout을 붙힐 것

```
ex) HeaderLayout
```

- 페이지 컴포넌트는 접미사로 page를 쓰며, 케밥 케이스로 작성

```
ex) stat-page.tsx
```



## 훅
- 모든 훅 파일은 hooks 폴더 아래에 작성
- 하나만 존재하는 파일은 훅 이름과 파일 명이 동일해야 함. use 접두어를 붙혀 카멜케이스로 작성.
- 여러 개의 훅을 묶는 파일은 케밥 케이스로 작성하며 접미사로 hook을 붙여야함 로작성해야 함

```
ex) useAuth
ex2) auth-hooks
```


## 페이지 컴포넌트
- 반드시 routes 폴더 아래에 작성하며 케밥케이스로 작성하고 접미사로 page를 붙힘

```
auth-page.tsx
login-page.tsx
```


## 테스트
- vitest 테스트는 test 폴더 아래에 작성하며 (파일이름).test.ts로 이름 명시
파일 이름은 테스트하는 모듈 파일의 이름과 동일해야 함.
```
tanstack-util.test.ts
```

- e2e는 e2e 폴더 아래에 작성하며 (파일이름).spec.ts 로 이름 명시
파일 이름은 케밥캐이스로 작성
```
login-service.spec.ts
```

- storybook 은 반드시 stories/components 아래에 작성하며 (파일이름).stories.ts로 이름 명시, 파일이름은 파스칼 케이스로 작성
```
ItemList.stories.ts
```

## 백엔드 파일
- 폴더명이 있다면 (도메인).(폴더명).ts로 작성
```
ex) controller 파일은
user.controller.ts
```
- 모든 파일명은 카멜 케이스로 작성


## 문서
- .md, .txt 등으로 작성한 모든 문서 목적 파일은 스네이크 케이스로 작성하며 파스칼 케이스로 작성
```
file_name_convention.md
```

- readme는 유일하게 대문자 케이스로만 작성 (README.md)


## 그 외 파일
- 모두 케밥 케이스로 작성

## 파일명 작성 케이스 요약

| 작성 케이스 | 적용 대상 | 파일명 형식 | 예시 | 비고 |
| --- | --- | --- | --- | --- |
| 케밥 케이스 | 폴더 | `kebab-case` | `my-folder` | 단어는 하이픈(`-`)으로 구분합니다. |
| 파스칼 케이스 | 일반 컴포넌트 | `PascalCase.tsx` | `ItemList.tsx` | 컴포넌트 이름과 파일명을 동일하게 작성합니다. |
| 파스칼 케이스 + `Layout` 접미사 | 레이아웃 컴포넌트 | `PascalCaseLayout.tsx` | `HeaderLayout.tsx` | 레이아웃 컴포넌트임을 이름으로 명확히 구분합니다. |
| 케밥 케이스 + `-page` 접미사 | 페이지 컴포넌트 | `kebab-case-page.tsx` | `stat-page.tsx` | `routes` 폴더 아래에 작성합니다. |
| `use` + 파스칼 케이스 | 단일 훅 파일 | `usePascalCase.ts` | `useAuth.ts` | 훅 이름과 파일명을 동일하게 작성합니다. |
| 케밥 케이스 + `-hooks` 접미사 | 여러 훅을 묶은 파일 | `kebab-case-hooks.ts` | `auth-hooks.ts` | 여러 훅을 한 파일에서 관리할 때 사용합니다. |
| 케밥 케이스 + `.test` 접미사 | Vitest 테스트 | `kebab-case.test.ts` | `tanstack-util.test.ts` | `test` 폴더 아래에 작성하며, 테스트 대상 모듈명과 일치시킵니다. |
| 케밥 케이스 + `.spec` 접미사 | E2E 테스트 | `kebab-case.spec.ts` | `login-service.spec.ts` | `e2e` 폴더 아래에 작성합니다. |
| 파스칼 케이스 + `.stories` 접미사 | Storybook 스토리 | `PascalCase.stories.ts` | `ItemList.stories.ts` | `stories/components` 폴더 아래에 작성합니다. |
| 카멜 케이스 + 역할 접미사 | 백엔드 파일 | `camelCase.role.ts` | `user.controller.ts` | 폴더명이 역할을 나타내는 경우 파일명 뒤에 역할명을 붙이며, 전체 파일명은 카멜 케이스로 작성합니다. |
| 스네이크 케이스 | 일반 문서 | `snake_case.md` 또는 `snake_case.txt` | `file_name_convention.md` | `.md`, `.txt` 확장자의 문서 목적 파일에 적용합니다. |
| 대문자 | README | `README.md` | `README.md` | README 파일에만 예외적으로 모두 대문자를 사용합니다. |
| 케밥 케이스 | 기타 파일 | `kebab-case` | `my-config` | 위 분류에 해당하지 않는 파일에 적용합니다. |

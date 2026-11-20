# 저장소 README API 설계

## 화면 요구와 데이터 분류

`RepoDashboardReadmeSection`은 기본 브랜치의 README 파일 경로 목록, 선택한 파일의 Markdown 원문, GitHub 원본 URL을 사용한다. 제목, 본문, 코드, 표, 링크와 이미지는 원문을 프론트에서 렌더링한다. 파일 개수는 목록 길이로 계산한다. 규칙 기반 추론이나 AI 수집 데이터는 필요하지 않다.

## GitHub 조회 방식

선택: REST. `repos.get`으로 기본 브랜치를 얻고 `git.getTree({tree_sha: default_branch, recursive: "true"})`로 경로와 blob SHA를 찾는다. 목록 조회 최소 2회, 파일 내용 조회 `git.getBlob` 1회다. `getTree`의 `truncated`가 true이면 불완전한 목록을 완전한 것처럼 제공하지 않고 503을 반환한다. blob 크기 제한은 서버에서 1 MiB로 적용한다. 기본 브랜치가 없는 빈 저장소는 빈 목록을 반환한다. REST Contents API의 `repos.getReadme`는 한 디렉터리의 README만 찾으므로 전체 목록을 얻는 데 적합하지 않다.

GraphQL 대안은 `repository.defaultBranchRef.target`의 Tree `entries`와 Blob `text`를 조회한다. 중첩 트리의 전체 README를 찾으려면 디렉터리마다 추가 조회가 필요해 호출 및 점수에 고정 상한을 제시할 수 없다. 얕은 저장소에서 첫 조회의 이론상 최소 비용은 1점이며 선택한 blob을 별도 요청하면 최소 2점이다. GraphQL `entries`에는 REST 재귀 트리와 같은 전체 탐색 보장이 없다.

공개 저장소는 인증 없이 조회할 수 있다. 비공개 저장소는 방문자의 접근 토큰이 필요하고 fine-grained 토큰은 Contents: read 권한이 필요하다. 서버는 기존 `checkToken`, `checkUser`로 방문자 토큰을 전달하고, 없는 경우 공개 API 토큰을 사용한다. 접근할 수 없는 저장소는 GitHub의 404에 맞춰 404로 응답한다. GitHub 호출 제한은 403/429, 일시적 장애나 잘린 트리는 503으로 구별한다.

근거: [Git trees](https://docs.github.com/en/rest/git/trees), [Git blobs](https://docs.github.com/en/rest/git/blobs), [Repository contents 및 README](https://docs.github.com/en/rest/repos/contents), [GraphQL Tree](https://docs.github.com/en/graphql/reference/objects#tree).

## 서버 계약

두 엔드포인트 모두 GET이며 body는 없다. 성공은 `CommonResponse<T>`, 오류는 `CommonErrorResponse`다. 경로 `owner`, `repo`는 GitHub 이름 형식으로 검사한다.

### `GET /api/repos/:owner/:repo/readmes`

쿼리 파라미터 없음. 응답 `GetRepoReadmesData`:

```json
{"defaultBranch":"main","documents":[{"path":"README.md","sha":"abc123"},{"path":"packages/a/README.md","sha":"def456"}]}
```

파일명은 대소문자 구분 없이 `README`, `README.md`, `README.markdown`으로 끝나는 blob만 포함한다. 경로 오름차순이며 루트 README를 먼저 둔다. 빈 저장소 또는 README가 없는 저장소는 `documents: []`다.

### `GET /api/repos/:owner/:repo/readmes/content?path=...`

`path` 필수. 목록에 포함된 정규화된 상대 경로여야 하며 절대 경로, `..`, 빈 세그먼트, 4096자 초과는 400이다. 기본 브랜치 트리에서 SHA를 재확인하므로 목록 조회 뒤 파일이 바뀌면 최신 내용을 표시한다. 응답 `GetRepoReadmeContentData`:

```json
{"path":"README.md","markdown":"# Project\n","htmlUrl":"https://github.com/owner/repo/blob/main/README.md","defaultBranch":"main"}
```

링크와 이미지 상대 경로는 프론트에서 해당 파일의 GitHub `blob`/`raw` 경로에 맞춰 변환한다. GitHub README에서 쓰는 HTML 이미지·정렬은 `rehype-raw`로 해석한 뒤 `rehype-sanitize`로 위험한 요소와 속성을 제거한다.

두 엔드포인트의 오류: 400 잘못된 저장소 이름 또는 파일 경로, 401 인증 실패, 403 접근 제한, 404 저장소나 선택 파일 없음, 429 요청 제한, 503 GitHub 일시 장애·부분 트리·크기 초과 파일, 500 예상 밖 서버 오류. 부분 목록은 성공으로 반환하지 않는다.

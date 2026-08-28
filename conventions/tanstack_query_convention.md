# Tanstack query 컨벤션


## 키 네이밍

- 호출하는 api 라우트에서 슬래쉬를 - 로 엮어서 소문자로 만든다.
- 단, api라는 단어는 제외시킨다.

```
ex) api/user/repos
=> user-repos
```

- 쿼리 파라미터가 오는 경우, 물음표를 제외하고 다음 배열 칸에 해당 정보 그대로 키로 사용한다.

```
ex) api/user/repos?name=taeseung
=> [user-repos,name=taeseung]
```

- 모든 키는 useTanstackKeys 훅을 통해 관리되어야 한다.


## staleTime 

- 기본 staleTime은 1분 이상의 시간을 가진다.
- 검색은 예외로 짧은 1분 이하의 시간으로 설정한다.
- 순수 인증 상태를 점검하는 api는 staleTime을 두지 않는다.
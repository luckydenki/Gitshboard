---
name: component-work
description: 컴포넌트 및 UI 변경이나 컴포넌트 추가를 요구한 경우 그 워크플로우를 설명한 스킬
---

## 지침

컴포넌트 및 UI 변경은 아래 기준에 따라 메인 에이전트가 직접 처리하거나 `component_worker`에 위임하세요. UX 점검과 피드백 작성은 `uiux_reviewer`가 담당하며, 점검과 피드백 전달은 `docs/UIUX-guide.md`를 따르세요.

## 피드백 루프

피드백 루프는 최대 3회 반복하세요 즉

component_worker -> uiux_reviewer -> component_worker -> uiux_reviewer -> component_worker-> uiux_reviewer 입니다. 

이 루프 처리 방법은 `uiux_reviewer` 의 서브 에이전트 처리 방식에 대해 확인하세요


## 예외

- **사용자 지시** : 대놓고 "간단하게" 와 같은 간단함을 나타내는 수식어를 썼거나 명시적으로 worker들을 호출하지 마라고 했을 경우 메인 에이전트가 직접 수정하고 `component_worker`와 `uiux_reviewer` 호출은 생략합니다. 
- **단순 변경**. 오탈자나 문구 수정, 스타일을 한 두개만 추가하거나 바꾸는 수준, `<a>``<Link>`같은 태그들의 링크만 좀 바꾸는 경우 메인 에이전트가 직접 수정합니다. `component_worker`와 `uiux_reviewer` 호출은 생략합니다. 

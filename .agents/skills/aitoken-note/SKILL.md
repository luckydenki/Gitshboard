---
name: aitoken-note
description: 작업 수행 후 subagent와 mainagent 브랜치간의 토큰 사용량을 기록하는 스킬 
---

자신의 브랜치명 prefix에 -subagent 와 -mainagent냐에 따라 다음을 수행하세요
만약 그러한 prefix가 없다면 기록을 거부하세요


## 공통

- 작업이 끝난 후 rollout-*.jsonl를 읽고 다음 정보를 저장해두세요

- 메인/서브 에이전트여부
- 모델·추론 수준
- token_usage_record의 입력·출력·캐시 입력·추론 출력·전체 토큰, 작업 완료 여부

response_id로 중복을 제거하고 누적값을 합산하지 말것. 없는 필드는 null로 기록하세요


## subagent로 끝나는 브랜치인 경우

 /AI-productivity/subagent 아래에 ,rollout.jsonl 에 기록하세요

 이 브랜치는 서브에이전트를 사용하게끔 지침을 짰을 것이기 때문에 서브에이전트의 사용량도 기록하세요



## mainagent 로 끝나는 브랜치인 경우

 /AI-productivity/mainagent 아래에 ,rollout.jsonl 에 기록하세요


 ## 집계

예시인데, 아래와 같은 방식으로 최종 집계를 해서 /mainagent 또는 /subagent 아래에 Token.md로 다음 표를 기록해두세요

 | 구분 | 메인 에이전트 | 서브 에이전트 |
|---|---:|---:|
| 입력 토큰 | 12,162,291 | 113,421 |
| └ 캐시 입력 | 12,118,656 | 62,208 |
| └ 비캐시 입력 | 43,635 | 51,213 |
| 출력 토큰 | 29,098 | 287 |
| └ 추론 출력 | 8,634 | 80 |
| **전체 토큰** | **12,191,389** | **113,708** |
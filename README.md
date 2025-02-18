# 프로젝트 실행 가이드

## 기술 스택

- **프레임워크**: Next.js (App Router)
- **언어**: TypeScript
- **스타일링**: Tailwind CSS
- **상태 관리**: MobX
- **API 통신**: Axios, SWR
- **인증 방식**: JWT

---

## 프로젝트 실행 방법
### 1. 레포지토리 클론
```bash
git clone https://github.com/workmakerdaily/bigs-project.git
cd bigs-project
```

### 2. 패키지 설치
```bash
yarn install
```

### 3. 개발 서버 실행
```bash
yarn dev
```
- 서버가 http://localhost:3000에서 실행됩니다.

---

이 프로젝트는 Next.js의 App Router를 기반으로 구축되었으며, 반응형 웹을 고려하여 Tailwind CSS를 사용하였습니다. 사용자는 JWT 기반 인증을 통해 로그인하고 게시판 기능을 활용할 수 있습니다.
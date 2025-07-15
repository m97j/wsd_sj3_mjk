
# Movie API Backend Service 🎬 (Express + MongoDB)

백엔드 API 개발 경험을 보여주기 위해 만든 **영화 정보 관리 RESTful API** 프로젝트입니다.  
영화 정보를 등록, 조회, 수정, 삭제(CRUD)할 수 있으며, 사용자 인증 및 권한 관리를 포함하고 있습니다.

- 🏷 **과제명:** WSD (Web Service Development) - Assignment 3
- 🛠 **개발 스택:** Node.js, Express, MongoDB, Mongoose, JWT, Swagger
- 🚀 **목적:** API 설계, 사용자 인증, DB 연동, API 문서화 경험

---

## 📌 주요 기능

| 기능 | 설명 |
|------|------|
| 🔑 사용자 인증 | JWT 기반 로그인, 회원가입, 패스워드 암호화 |
| 🎥 영화 관리 | 영화 정보 CRUD (제목, 장르, 개봉일 등) |
| 👥 권한 관리 | 사용자 권한에 따라 기능 제한 |
| 📝 Swagger | API 문서 자동화 및 테스트 지원 |

---

## 🛠 사용 기술

- **Node.js** & **Express** – 서버 및 API 개발
- **MongoDB** & **Mongoose** – NoSQL 데이터베이스
- **JWT (jsonwebtoken)** – 인증 및 보안
- **bcryptjs** – 비밀번호 암호화
- **Swagger (swagger-ui-express, swagger-jsdoc)** – API 문서 자동화
- **CORS, Body-Parser** – 요청 처리

---

## 📂 프로젝트 구조


```
wsd\_sj3\_mjk/
├── models/          # MongoDB 스키마 정의
├── routes/          # API 라우터
├── controllers/     # 비즈니스 로직
├── middleware/      # 인증/보안 미들웨어
├── swagger/         # Swagger 문서 설정
├── app.js           # 메인 서버 코드
├── package.json
└── README.md

````

---

## 🌐 배포 방법 (실제 서비스 운영 관점)

이 프로젝트는 **일반적이고 업계에서 선호되는 배포 방법**을 통해 웹 서비스화 했습니다.

### ✅ 1. 클라우드 배포 (추천 ⭐️)
- **Heroku**: 무료 플랜, 빠른 배포 (개발 단계에 적합)
- **Render**: 간단하고 무료 플랜 가능
- **Railway.app**: 간편 배포에 적합
- **Vercel** or **Netlify**: 정적 + 서버리스 함수 가능 (백엔드만은 비추천)

👉 추천: **Render** 또는 **Railway** (Node.js + MongoDB)

### ✅ 2. 배포 방법 요약 (Render 기준)

```bash
# 1. GitHub Repository 연결
# 2. 환경변수 설정 (예: MONGO_URI, JWT_SECRET)
# 3. 자동 배포 (Push → Build → Deploy)
````

> 💡 실제 서비스 운영 시에는 **.env 파일**로 환경변수를 관리해야 하며,
> MongoDB Atlas (클라우드 DB)와 함께 배포할 수 있습니다.

---


## 📝 프로젝트 회고 및 학습 포인트

* RESTful API 설계 및 구현 경험
* JWT 인증 프로세스 이해 및 적용
* Swagger 문서화를 통한 협업 및 테스트 편의성
* MongoDB/Mongoose 기반의 데이터 모델링
* 기본적인 Express 서버 아키텍처 설계

---

## 📬 연락처

* 📧 Email: [your\_email@example.com](mailto:your_email@example.com)
* 💼 [LinkedIn](https://linkedin.com/in/yourprofile) *(선택)*
  
---

> 본 프로젝트는 **백엔드 API 개발 역량**을 보여주기 위한 포트폴리오의 일부입니다.
> 실제 서비스 배포 및 확장성을 고려하여 작성되었습니다.


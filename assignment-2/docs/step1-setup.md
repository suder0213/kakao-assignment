# 1단계 학습 로그 — 프로젝트 환경 설정

## 사용한 프롬프트

> 이제 1단계부터 수행해

> 구현 계획에 "각 단계 구현 마다 핵심 구현, 내용 요약 문서를 만든다" 라는 내용을 명시해. 또한 문서를 수정할 때, 내가 입력한 프롬프트를 추가해서 추가적인 질문이 있었다는 것도 명시하도록 해줘

> 현재 1단계를 수행한 상태이니 문서 작성해줘

---

## 핵심 구현 내용 요약

- Vite 템플릿 파일 중 불필요한 파일 6개 삭제
- `src/index.css`를 assignment-1의 `style.css`로 전면 교체
- `src/App.jsx`를 헤더만 있는 최소 구조로 초기화
- `index.html`의 언어 속성을 `ko`로, 타이틀을 `Todo App`으로 수정

---

## 파일 구조 변화

### 삭제된 파일

| 파일 | 이유 |
|---|---|
| `src/App.css` | Vite 템플릿 전용 스타일. `index.css`로 통일 |
| `src/assets/hero.png` | 템플릿 데모 이미지 |
| `src/assets/react.svg` | 템플릿 데모 이미지 |
| `src/assets/vite.svg` | 템플릿 데모 이미지 |
| `public/icons.svg` | 템플릿 데모 아이콘 |
| `README.md` | Vite 기본 안내 문서 |

### 정리 후 구조

```
assignment-2/
├── index.html          ← lang="ko", title="Todo App"으로 수정
├── vite.config.js
├── package.json
├── eslint.config.js
├── .gitignore
├── public/
│   └── favicon.svg
└── src/
    ├── main.jsx        ← 변경 없음
    ├── index.css       ← assignment-1 style.css 전체 이식
    └── App.jsx         ← 헤더만 있는 최소 구조로 초기화
```

---

## React 프로젝트 진입점 구조

Vanilla JS와 React는 브라우저가 앱을 처음 실행하는 방식이 다르다.

### Vanilla JS (assignment-1)

```
브라우저가 index.html 로드
  → <link rel="stylesheet" href="style.css">  ← CSS 직접 로드
  → <script src="app.js">                     ← JS 직접 실행
      전역 변수 선언, 이벤트 리스너 등록, renderTodoList() 호출
```

HTML이 구조를 직접 기술하고, JS가 거기에 붙는 구조다.

### React + Vite (assignment-2)

```
브라우저가 index.html 로드
  → <script type="module" src="/src/main.jsx">  ← 모듈로 JS 진입
      → main.jsx
          import App from './App.jsx'
          createRoot(document.getElementById('root')).render(<App />)
              → App.jsx가 반환하는 JSX를 <div id="root">에 마운트
```

HTML은 `<div id="root">` 하나만 있고, React가 그 안을 전부 채운다.

### index.html 비교

```html
<!-- Vanilla JS: HTML이 구조를 직접 기술 -->
<body>
  <div class="container">
    <header class="app-header">...</header>
    <section class="week-nav">...</section>
    <!-- ... -->
  </div>
  <script src="app.js"></script>
</body>

<!-- React: HTML은 빈 그릇, JS가 내용을 채움 -->
<body>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
```

---

## 처음 등장한 React 개념

### `main.jsx` — React 루트 마운트

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

- `createRoot(el)`: 지정한 DOM 요소를 React가 관리하는 루트로 만든다.
- `.render(<App />)`: `App` 컴포넌트를 루트에 그린다. 이후 모든 UI 업데이트는 React가 이 루트 안에서 관리한다.
- `StrictMode`: 개발 중 잠재적인 문제를 감지하기 위해 일부 함수를 의도적으로 두 번 호출한다. 프로덕션 빌드에서는 동작하지 않는다.

> **추가 질문: StrictMode가 검출하는 버그에는 어떤 예가 있어?**
>
> 대표적인 세 가지 문제를 감지한다.
>
> **1. 순수하지 않은 렌더 함수**
>
> StrictMode는 컴포넌트 함수를 의도적으로 두 번 호출한다. 렌더 함수는 같은 입력이면 항상 같은 출력을 내야 하는데, 외부 변수에 의존하면 두 번 호출했을 때 결과가 달라진다.
>
> ```jsx
> let count = 0
>
> function Counter() {
>   count++  // 렌더할 때마다 외부 변수를 바꿈
>   return <p>{count}</p>
>   // 정상 모드: 1 표시
>   // StrictMode: 두 번 호출 → 2 표시 → 버그 노출
> }
> ```
>
> **2. `useEffect` 클린업 누락**
>
> StrictMode는 마운트 → 언마운트 → 재마운트를 강제로 한 번 더 실행한다. 이벤트 리스너나 타이머를 등록하고 클린업하지 않으면 중복 등록 버그가 드러난다.
>
> ```jsx
> useEffect(() => {
>   window.addEventListener('resize', handleResize)
>   // 클린업 없음 → 재마운트 시 리스너가 두 개 등록됨
> }, [])
>
> // 올바른 방법
> useEffect(() => {
>   window.addEventListener('resize', handleResize)
>   return () => window.removeEventListener('resize', handleResize)  // 클린업
> }, [])
> ```
>
> **3. 더 이상 사용되지 않는 API 감지**
>
> React가 deprecated 처리한 구식 API를 사용하면 콘솔에 경고를 출력한다. 클래스 컴포넌트의 `componentWillMount`, `componentWillUpdate` 같은 라이프사이클 메서드가 해당된다. 현재 함수형 컴포넌트 중심으로 개발하면 크게 해당되지 않는다.
>
> 세 경우 모두 **프로덕션에서는 조용히 넘어가지만 나중에 찾기 어려운 버그들**이다. StrictMode는 이것들을 개발 중에 일부러 과장해서 드러낸다.

### `.jsx` 확장자

`.jsx`는 JS 안에 HTML처럼 생긴 JSX 문법을 쓸 수 있는 파일이다. 브라우저가 직접 이해하는 것이 아니라 Vite(내부적으로 Babel 또는 esbuild)가 빌드 시점에 일반 JS로 변환한다.

```jsx
// JSX
function App() {
  return <h1 className="app-title">Todo</h1>
}

// 변환 후 JS
function App() {
  return React.createElement('h1', { className: 'app-title' }, 'Todo')
}
```

### `className` vs `class`

JSX에서는 HTML의 `class` 속성을 `className`으로 써야 한다. `class`가 JS의 예약어이기 때문이다.

```jsx
// HTML
<h1 class="app-title">Todo</h1>

// JSX
<h1 className="app-title">Todo</h1>
```

### Vite란?

빌드 도구 겸 개발 서버다. `.jsx` 파일을 브라우저가 이해할 수 있는 JS로 변환하고, 파일이 저장될 때마다 브라우저를 자동으로 갱신(HMR, Hot Module Replacement)해준다. `npm run dev`로 실행한다.

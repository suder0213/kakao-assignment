# 2단계 학습 로그 — 상태별 필터링

## 구현 요약

- 전체 / 진행 중 / 완료 필터 탭 추가
- `currentFilter` 상태 변수로 현재 선택된 탭 관리
- `getFilteredList()` — 필터 조건에 맞는 Todo만 반환
- `setFilter()` — 탭 클릭 시 active 클래스 전환 후 재렌더링
- 탭별 카운터 문구, 빈 상태 메시지 분기 처리

---

## 심화 정리

### `getElementsByX` vs `querySelectorX`

**탐색 기준**

`getElementsByX`는 태그명 / 클래스명 / id 각각 전담 메서드가 따로 있다. 반면 `querySelectorX`는 **CSS 선택자 문법을 탐색 기준으로 사용**하기 때문에, CSS에서 쓸 수 있는 선택자라면 무엇이든 그대로 넣을 수 있다. `getElementsByX` 세 개를 하나로 통합한 인터페이스라고 볼 수 있다.

```js
querySelector('li')                   // 태그명
querySelector('.todo-text')           // 클래스
querySelector('#todoInput')           // id
querySelector('[data-id="3"]')        // 속성값
querySelector('.todo-item.completed') // 복합 클래스
querySelector('ul li:last-child')     // 구조적 관계
```

**반환 타입과 forEach**

| 메서드 | 반환 타입 | forEach 바로 사용 |
|---|---|---|
| `getElementsByX` | HTMLCollection (live) | 불가 |
| `querySelectorAll` | NodeList (static) | 가능 |

HTMLCollection은 `forEach`가 없어서 `Array.from()`으로 변환해야 순회할 수 있다.

**Live vs Static — 루프 중 DOM 변경 시 차이**

`getElementsByX`는 live collection으로, DOM이 변경되면 실시간으로 반영된다. 아래처럼 루프 중 요소를 삭제하면 `all`의 길이와 인덱스가 즉시 바뀌어, `break` 없이 계속 순회하면 인덱스가 어긋나는 버그가 생긴다.

```js
// live — 루프 중 삭제 시 인덱스 어긋날 수 있음
var all = document.getElementsByTagName("li");
for (var i = 0; i < all.length; i++) {
    if (all[i].textContent === "Contact") {
        all[i].parentNode.removeChild(all[i]); // all이 실시간 갱신됨
    }
}

// static — 호출 시점 스냅샷이라 루프 중 삭제해도 안전
var all = document.querySelectorAll("li");
```

**복합 선택자 지원**

`getElementsByX`는 단순 탐색만 가능하다. 예를 들어 `.todo-item.completed`(두 클래스를 동시에 가진 요소)를 찾으려면 직접 필터링해야 한다.

```js
// getElementsByX — 두 단계 필요
var items = document.getElementsByClassName('todo-item');
var completed = Array.from(items).filter(el => el.classList.contains('completed'));

// querySelectorAll — 한 줄로 끝
document.querySelectorAll('.todo-item.completed')
```

`data-id` 같은 속성값 탐색은 `getElementsByX` 자체가 지원하지 않아 더욱 번거롭다.

```js
// getElementsByX — 전체 순회하며 직접 비교해야 함
var all = document.getElementsByTagName('li');
var target = Array.from(all).find(el => el.dataset.id === '3');

// querySelectorAll — 한 줄로 끝
document.querySelector('[data-id="3"]')
```

**결론**

`querySelector` / `querySelectorAll` 하나로 모든 경우를 처리할 수 있어 선호된다. `getElementById`만 예외적으로 id 탐색에 계속 사용하는데, 내부적으로 더 빠르고 의도가 명확하기 때문이다.

---

### `.active`를 `:`가 아닌 `.`으로 쓴 이유

CSS의 `:` 가상 클래스는 브라우저가 자동으로 감지하는 상태에 쓴다.

```css
:hover      /* 마우스가 위에 있나 — 브라우저가 감지 */
:focus      /* 키보드/클릭으로 활성화됐나 — 브라우저가 감지 */
:checked    /* 체크박스/라디오가 선택됐나 — 브라우저가 감지 */
:last-child /* HTML 구조상 마지막 자식인가 — 브라우저가 감지 */
```

"세 탭 중 어떤 게 선택됐는가"는 앱이 만들어낸 개념이다. `<button>`은 HTML 네이티브 요소지만, "활성화된 탭"이라는 상태는 HTML 스펙에 정의되어 있지 않아 브라우저가 감지할 수 없다. 그래서 JS가 직접 클래스를 붙였다 떼는 방식으로 상태를 표현하고, CSS는 그 클래스가 있을 때의 스타일만 정의한다.

```js
tab.classList.add('active');    // JS가 "이 탭이 선택됨"을 CSS에 알림
tab.classList.remove('active');
```

```css
.filter-tab.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}
```

**보완: 브라우저가 "선택"을 아는 경우**

`<input type="radio">`처럼 HTML 네이티브 요소는 브라우저가 선택 상태를 직접 감지할 수 있어, JS 없이도 스타일링이 가능하다.

```css
input[value="all"]:checked + label { color: #672be0; }
```

즉 **선택 상태가 HTML 스펙에 정의된 요소(`input`, `select`)는 브라우저가 감지할 수 있고, `<button>`처럼 스펙에 정의되지 않은 앱 수준의 상태는 브라우저가 모른다**는 것이 정확한 표현이다.

**`<button>`에서 브라우저가 감지할 수 있는 상태**

`<button>`도 HTML 스펙에 정의된 상태는 브라우저가 감지할 수 있다.

```css
button:hover    /* 마우스를 올렸을 때 */
button:focus    /* 키보드 탐색 등으로 포커스됐을 때 */
button:active   /* 클릭하는 순간 (누르고 있는 동안) */
button:disabled /* disabled 속성이 붙었을 때 */
```

이것들은 입력 장치나 HTML 속성 기반의 상태라 브라우저가 직접 감지한다. 반면 "이 버튼이 현재 선택된 탭이다"는 앱 로직이 부여하는 의미라 브라우저가 알 수 없다.

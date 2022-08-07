/** Item 54 객체를 순회하는 노하우 */

export {};

const obj = {
  one: "uno",
  two: "dos",
  three: "tres",
};

// 왜 k는 one | two | three가 아닐까?
for (const k in obj) {
  const v = obj[k];
}

interface ABC {
  a: string;
  b: string;
  c: number;
}

// 이런 경우에 abc는 a,b,c 이외의 앙여속성을 가진 객체도 들어올 수 있으므로 k 는 string으로 추론되게 만든 것이 옳다
function foo(abc: ABC) {
  for (const k in abc) {
    const v = abc[k];
  }
}

const x = { a: "a", b: "b", c: 2, d: new Date() };
foo(x); // 정상이기 때문이다.

// 해결법
function foo2(abc: ABC) {
  let k: keyof ABC;
  for (k in abc) {
    const v = abc[k]; // string | number로 추론된다.
  }
}
// 이렇게 하면 잉여속성을 넣지 못 한다. 런타임의 동작을 예상하기 어렵다.

// 골치아픈 문제 없이 단지 객체의 키와 값을 순회하고 싶다면? Object.entries를 사용하자.

function foo3(abc: ABC) {
  for (const [k, v] of Object.entries(abc)) {
    k; // string
    v; // any
    // 합리적인 추론이다.
  }
}

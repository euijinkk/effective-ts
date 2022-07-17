// ts-node로 TS 콘솔에서 실행하기
// node는 TS를 해석하지 못 한다.
// ts-node [file].ts 로 실행한다.

// tsc -> js로 compile 한다
// node [file].js -> js 파일을 실행한다.

// Item 1

// 자바스크립트 런타임에서는 오류가 발생하지 않는데, 타입 체커에서 오류를 잡는 경우
const a = [] + 7;

alert("Hello", "Typescript");

// 런타임에서 오류가 발생하는데, 타입 체커가 잡지 못 하는 경우
const names = ["Alice", "Bob"];

console.log(names[2].toUpperCase());

// 타입스크립트를 대하는 자세 - 최소한 자바스크립트 런타임에서의 오류를 잡도록 노력하고, 런타임에서 나타나지 않는 휴먼에러를 방지하자.

// 타입스크립트가 이해하는 값의 타입과 실제 값에 차이가 있기 때문이다. 이를 조정하에 런타임단에서 에러를 잡아주자.

/* Item 2  */

// noImplicitAny Error
function add(a, b) {
  return a + b;
}

// strictNullChecks
const x: number | null = null;

const assertionX = x!;
type AssertionX = typeof assertionX;

/* Item 3 */

// 만약 오류가 있을 때 컴파일 하지 않으려면, tsconfig.json에 noEmitOnError를 설정하거나 빌드도구에 동일하게 적용하면 됩니다.

// 런타임시에 타입 정보를 활용하고 싶다면?

// 1. 태그를 활용한다.

interface Square {
  kind: "square";
  width: number;
}

interface Rectangle {
  kind: "rectangle";
  height: number;
  width: number;
}

type Shape = Square | Rectangle;

function calculateArea(shape: Shape) {
  if (shape.kind === "rectangle") {
    return shape.width * shape.height;
  } else {
    return shape.width * shape.width;
  }
}

// 2. 클래스를 활용한다.
// 클래스는 값이며 동시에 타입이다.

class Square2 {
  constructor(public width: number) {}
}
class Rectangle2 extends Square2 {
  constructor(public width: number, public height: number) {
    super(width);
  }
}

// 타입스크립트 타입으로는 함수를 오버로드 하기

// C++ 같은 언어는 동일핞 이름에 매개변수만다 른 여러 버전의 함수를 허용합니다.
// 이를 함수 오버로딩이라고 합니다.
// 그러나 타입스크립트에선느 타입고, 런타임의 동작이 무관하기 때문에, 함수 오버로딩이 불가능합니다.
// 타입스크립트가 함수 오버로딩 기능을 지원하기는 하지만, 온전히 타입 수준에서만 동작합니다.
// 하나의 함수에 여러 개의 선언문을 작성할 수 있지만, 구현체는 오직 하나 분입니다.
function add2(a: number, b: number): number;
function add2(a: string, b: string): string;
function add2(a: any, b: any) {
  return a + b;
}

add2(3, 4);

/* Item 4 구조적 타이핑에 익숙해지기 */

// 자바스크립트는 본질적으로 덕타이핑 기반입니다.
// 덕타이핑이란, 객체가 어떤 타입에 부합하는 변수와 메서드를 가질 경우 객체를 해당 타입에 속하는 것으로 간주하는 방식입니다.
// 만약 어떤 새가 오리처럼 걷고, 헤염치고, 꽤꽥거리는 소리를 낸다면 나는 그 새를 오리라고 부를 것이다.
// 즉, 런타임에 타입을 체크하는 것

// 자바스크립트는 덕타이핑 (런타임에서), 타입스크립트는 구조적 타이핑
// 구조적 타이핑은 컴파일 단계에서 타입을 체크한다.

// https://vallista.kr/%EB%8D%95-%ED%83%80%EC%9D%B4%ED%95%91%EA%B3%BC-%EA%B5%AC%EC%A1%B0%EC%A0%81-%ED%83%80%EC%9D%B4%ED%95%91/

interface XY {
  x: number;
  y: number;
}

function addXY(xy: XY) {
  return xy.x + xy.y;
}

const xyz = {
  x: 4,
  y: 5,
  z: 6,
};

// @ISSUE: 왜 하나는 되고 하나는 안되는거야?
// xyz는 여러곳에서 사용될 변수이니 sub type으로 받아들이는데 (open type)
// 리터럴의 경우 한곳에만 사용될 것이니 타입이 구조적으로 일치해야만 한다 (sealed type, precise type)
addXY(xyz); // 통과
addXY({ x: 3, y: 4, z: 5 }); // 에러

//
const aaa = Object.keys(xyz);
type AAA = typeof aaa;
// Object.keys의 반환값은 무조건 string[]인데, xyz의 key만을 뽑아서 반환하게 할수는 없을까?
for (const axis of Object.keys(xyz)) {
  const coord = xyz[axis];
}

// 구조적 타이핑의 장점
// 1. 테스트가 용이하다
// 2. 라이브러리간의 의존성을 완벽히 분리할 수 있다.

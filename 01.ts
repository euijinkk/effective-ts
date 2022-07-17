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

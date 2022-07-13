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

/* 5장 any 다루기 */

// 타입스크립트의 타입 시스템은 선택적이고 점진적입니다. 따라서 타입스크립트는 프로그램의 일부분에만 타입시스템을 적용할 수 있습니다.
// 점진적 마이그레이션이 가능합니다.
// 마이그레이션을 할 때 코드의 일부분에 타입체크를 비활성화시켜주는 any 타입이 중요한 역할을 합니다.

/* Item 38 any 타입은 가능한 한 좁은 범위에서만 사용하기 */

interface Config {
  a: number;
  b: number;
  c: { key: "123" };
}

const config: Config = {
  a: 1,
  b: 2,
  c: { key: "456" },
} as any; // 이렇게 하지 말자

const config2: Config = {
  a: 1,
  b: 2,
  c: { key: "456" as "123" },
};
// 가능한 한 좁게 any 를 선언해주기

/* Item 39 any를 구체적으로 변형해서 사용하기 */
// 배열에는 any 보다는 any[] ,
// 객체에는 any 보다는 {[key:string]: any}
// object는 non-primitive 타입을 포함하는 타입이다.

// 함수의 타입에는
// () => any
// (arg:any) => any
// (...args:any[]) => any   <=> Function 과 동일하다.

/* Item 40 함수 안으로 타입 단언문 감추기 */
// 함수를 작성하다 보면, 외부로 드러난 타입 정의는 간단하지만 내부 로직이 복잡해서 안전한 타입으로 구현하기 어려운 경우가 많습니다.
// 함수의 모든 부분을 안전한 타입으로 구현하는 것이 이상적이지만, 불필요한 예외 상황까지 고려해가며 타입 정보를 힘들게 구성할 필요는 없습니다.
// 함수 내부에는 타입 단언을 사용하고 함수 외부로 드러나는 타입 정의를 정확히 명시하는 정도로 끝내는게 낫습니다.
// 프로젝트 전반에 위험한 타입 단언문이 드러나 있는 것 보다, 제대로 타입이 정의된 함수 안으로 타입 단언문을 감추는 것이 더 좋은 설계입니다.

// 함수 내부에 any가 있더라도 반환타입을 명시하면, 타입 정의에는 any가 없기 때문에, 함수를 호출하는 쪽에서는 any가 사용됐는지 알 지 못한다.

// 함수의 반환값을 추론할 수 있더라도 명시해주자

// 타입 단언문은 일반적으로 타입을 위험하게 만들지만 상황에 따라 필여하기도 하고 현실적인 해결책이 되기도 합니다.
// 불가피하게 사용해야 한다면, 정확한 정의를 가지는 함수 안으로 숨기도록 합니다.

/* any 타입의 진화 이해하기 */

// 타입스크립트는 일반적으로 변수의 타입은 변수를 선언할 때 결정됩니다.
// 그 이후에 정제될 수 있지만 (타입가드), 새로운 값이 추가되도록 확장할 수는 없습니다.
// 그러나 any 타입과 관련해서 예외인 경우가 존재합니다.

function range(start: number, limit: number) {
  const out = []; // any []
  for (let i = start; i < limit; i++) {
    out.push(i);
  }

  return out; // number[]
}
// out의 타입은 any[]로 선언되었지만 number 타입의 값을 넣는 순간부터 타입은 number[]로 진화(evolve)합니다.

// 배열에 다양한 타입의 요소를 넣으면 배열의 타입이 확장되며 진화합니다.

const result = []; // any[]
result.push("a");
result; // string[]

// 변수의 초기값이 null인 경우도 any의 진화가 일어납니다.
// any 타입의 진화는 noImplicitAny가 설정된 상태에서 변수의 타입이 암시적 any인 경우에만 일어납니다.

let val = null; // any
val = 3;
val; // number

/* Item 42 모르는 타입의 값에는 any 대신 unknown을 사용하기 */

let co: number = 3;
let bbb: unknown = 3;
co = bbb;

let co2: number = 3;
let bbb2: any = 3;
co2 = bbb2;

// 할당 가능성 관점에서의 any
// 1. 어떤 타입이든 any 타입에 할당 가능하다. (unknown도 동일))
// 2. any 타입은 어떠한 타입으로도 할당가능하다. (unknown은 아니다, never는 맞다)
// 타입을 값의 집합으로 생각하기 의 관점에서 한 집합은 모든 집합의 부분집합이면서 동시에 상위집합이 될 수 없기 떄문에 분명히 any는 타입시스템과 상충되는 면을 가지고 있다.
// unknown은 any 대신에 쓸 수 있는 타입시스템에 부합하는 타입입니다.

// unknown의 반대는 never이다.
// unknown은 어떤 타입도 unknown에 할당될 수 있다. (최 상위 집합)
// never는 어떠한 타입에도 할당 가능하다 (최 하위 집합)

// 어떠한 값이 있지만 그 타입을 모르는 경우에 unknown을 사용한다.
// 가능한 모든 것을 담을 수 있는 경우 unknown이다.
// string, number, boolean, object 모두 들어올 수 있다면?

// any로 정의하면?
function parseYAML(yaml: string): any {}

interface Book {
  name: string;
  author: string;
}

const book = parseYAML(`
  name: HAHA
  author: Emily
`);

book.title; // 오류 없음. 런타임에 undefined 경고
book("read"); // 오류 없음. 런타임에 TypeError: book은 함수가 아닙니다. 예외 발생

// unknown으로 정의하면?
function parseYAML2(yaml: string): unknown {
  return 1;
}

const book2 = parseYAML2(`
  name: HAHA
  author: Emily
`);

book2.title; // 에러
book2("read"); // 에러

// 타입 내로잉을 해주자 (사용자 정의 타입 가드, instanceof 가드 등)

// 제네릭으로 정의하면?

function safeParseYAML<T>(yaml: string): T {
  return parseYAML(yaml);
}
// 일반적으로 타입스크립트에서 좋지 않은 스타일입니다.
// 제네릭을 사용한 스타일은 타입 단언문과 달라 보이지만 기능적으로는 동일합니다.
// 제네릭보다는 unknown을 반환하고 사용자가 직접 단언문을 사용하거나 원하는 대로 타입을 좁히도록 강제하는 것이 좋겠습니다.

// unknown을 쓰는 경우
// 반환 타입을 모르는 경우
// 모든 타입이 들어올 수 있는 경우
//

// unknown 과 유사한 타입. => {} , object
let aavd: {} = {};
aavd = 3;
aavd = null;
aavd = undefined;
aavd = true;
aavd = "a";
aavd = { a: 1 };

// Object === {}
let aadfsd: Object = {};
aadfsd = 12;

aadfsd = null;
aadfsd = undefined;
aadfsd = true;
aadfsd = "34";
aadfsd = { a: 1 };
// object vs Object({}와 같구나)

let obj: object = {};
obj = 1;
obj = true;
obj = undefined;
obj = null;
obj = { a: 1 };
obj = [1, 2, 3];
obj = () => 3;

// {} 타입은 null과 undefined를 제외한 모든 값을 포함합니다.
// object 타입은 모든 비기본형 타입(non-primitive)으로 이루어집니다.

/* Item 43 몽키 패치 보다는 안전한 타입을 사용하기 */
// 모듈의 관점에서(import/export) 제대로 동작하게 하려면 global 선언을 추가해야합니다.

declare global {
  interface Document {
    monkey: string;
  }
}

// declare module , declare global 차이점. d.ts는 어떻게 정의되는가?

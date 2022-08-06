/* 3장 타입추론 */
// 산업계에서 사용되는 프로그래밍 언어들에서는 '정적 타입'과 '명시적 타입이 전통적으로 같은 의미로 쓰였습니다. 그래서 C, C++, 자바에서는 타입을 직접 명시합니다.
// 그러나 학술계의 언어에서는 이 두가지 타입을 결코 혼동해서 쓰지 않습니다. 학술계로 분류되는 ML과 하스켈 같은 언어는 오래전부터 정교한 타입 추론 시스템을 가지고 있었습니다.
// 학술계 언어의 발전에 대응하여 10년전부터는 기존 산업게의 언어에도 타입 추론 기능이 추가되기 시작했습니다.

// 타입스크립트는 타입 추론을 엄격하게 수행합니다.
// 타입스크립트 초보자와 숙련자는 타입 구문의 수에서 차이가 납니다. 숙련된 타입스크립트 개발자는 비교적 적은 수의 구문을 사용합니다.
// 반면 초보자의 코드는 불필요한 타입구문으로 도배되어 있을 겁니다.

/* Item 19 추론 가능한 타입을 사용해 장황한 코드 방지하기 */
// 이상적인 타입스크립트 코드는 함수/메서드 시그니처에 타입 구문을 포함하지만, 함수 내에서 생성된 지역 변수에는 타입 구문을 넣지 않습니다. 타입 구문을 생략하여 방해되는 것들을
// 최소화하고 코드를 읽는 사람이 구현로직에 집중할 수 있게 하는 것이 좋습니다.

// 타입이 추론될 수 있음에도 여전히 타입을 명시하고 싶은 몇 가지 상황이 있습니다.
// 그 중하나는 객체 리터럴을 정의할 때입니다.
// 정의에 타입을 명시하면, 잉여속성체크가 동작합니다.
// 잉여속석체크는 특히 선택적 속성이 있는 타입의 오타 같은 오류를 잡는 데 효과적입니다.
// 그리고 변수가 사용되는 순간이 아닌 할당하는 시점에 오류가 표시되도록 해줍니다.
// 만약 타입 구문을 제거한다면 잉여속성체크가 동작하지 않고, 객체를 선언한 곳이 아니라 객체가 사용되는 곳에서 타입오류가 발생합니다.
// 그러나 타입 구문을 명시한다면 실제로 실수가 발생한 부분에 오류를 표시해줍니다.

// 마찬가지로 함수의 반환에도 타입을 명시하여 오류를 방지할 수 있습니다. 타입 추론이 가능할지라도 구현상의 오류가 함수를 호출한 곳까지 영향을 미치지 않도록 하기 위해 타입 구문을 명시하는 게 좋습니다.

/* Item 26 타입 추론에 문맥이 어떻게 사용되는지 이해하기 */
// 타입스크립트는 타입을 추론할 때 단순히 값만 고려하지는 않습니다. 값이 존재한느 곳의 문맥까지도 살핍니다. 그런데 문맥을 고려해 타입을 추론하면 가끔 이상한 결과가 나옵니다.
// 이때 타입 추론에 문맥이 어떻게 사용되는지 이해하고 있다면 제대로 대처할 수 있습니다.

type Language = "JavaScript" | "TypeScript" | "Python";

function setLanguage(language: Language) {}

// 인라인 형태
setLanguage("JavaScript");

// 침조 형태
let language = "JavaScript";
setLanguage(language);

// 튜플 사용 시 주의할 점
function panTo(where: [number, number]) {}
panTo([10, 20]);

const loc = [10, 20];
const loc2: [number, number] = [10, 20];
const loc3 = [10, 20] as const;
panTo(loc); // number[] 형식의 인수는 [number, number]에 핟당될 수 없습니다.

panTo(loc2);
panTo(loc3);
// const는 단지 값이 가리키는 참조가 변하지 않는 얕은(shallow) 상수인 반면,
// as const는 그 값이 내부까지 (deeply) 상수라는 사실을 타입스크립트에게 알려줍니다.

const var2 = {
  a: {
    b: { c: "3" },
  },
};

var2.a = { b: { c: "b" } };
// 얕은 상수라고 표현해도 될까? 1뎁스까지 추론하는 것이 얕은인가?

const var3: readonly [number, number] = [3, 4];

let var4: [number, number] = var3;

// 객체 사용 시 주의할 점
interface GovernedLanguage {
  language: Language;
  organization: string;
}

function complain(language: GovernedLanguage) {}

complain({ language: "TypeScript", organization: "Microsoft" });
const ts = {
  language: "TypeScript",
  organization: "Microsoft",
};
complain(ts); // string은 Language에 할당될 수 없습니다. Type A is not assignable to Type B

// 콜백 사용 시 주의점
function callWithRandomNumbers(fn: (n1: number, n2: number) => void) {
  fn(Math.random(), Math.random());
}

// 매개변수로 바로 콜백을 넣을 경우 추론된다.
callWithRandomNumbers((a, b) => {
  a; // number
  b; // number
  console.log("a+b", a + b);
});

const fn = (a, b) => {
  a; // any
  b; // any
  console.log("a+b", a + b);
};

callWithRandomNumbers(fn);

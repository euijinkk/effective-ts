/* Item 6 편집기를 사용하여 타입 시스템 탐색하기 */

/* Item 7 타입이 값들의 집합이라고 생각하기 (아주 재밌는 단원!) */

// 타입은 할당 가능한 값들의 집합이라고 생각하면 쉽습니다.
// 가장 작은 집합은 아무 값도 포함하지 않는 공집합이며 타입스크립트에서는 never 타입입니다.
// never 타입으로 선언된 변수의 범위는 공집합이기 때문에 아무런 타입도 할당할 수 없습니다.
// 그 다음으로 작은 집합은 한 가지 값만 포함하는 타입입니다.
// 이들은 타입스크립트에서 유닛 타입이라고도 불리는 리터럴 타입입니다.
// 두개 혹은 세개를 묶으려면 유니온 타입을 사용합니다.
// 유니온 타입은 값 집합들의 합집합
// 타입스크립트 오류에서 assignable 이라는 문구를 볼 수 있습니다.
// 이 문구는 집합의 관점에서 '~의 원소' 또는 '~의 부분 집합'을 의미합니다.

type AB = "A" | "B";
const a: AB = "A"; // 'A'는 집합 {'A', 'B'}의 원소입니다.
// 타입 체커는 하나의 집합이 다른 집합의 부분 집합인지 검사하는 것.

// &은 교집합이라면서 왜 이상하게 해석되지?
interface Person {
  name: String;
}

interface Lifespan {
  birth: Date;
  death: DataView;
}

type PersonSpan = Person & Lifespan;

// & 연산자는 두 타입의 인터섹션을 계산합니다. 언뜻 보기에 두 인터페이스는 공통으로 가지는 속성이 없기 때문에, 공집합으로 예상하기 쉽습니다.
// 하지만 타입 연산자는 인터페이스의 속성이 아닌, 값의 집합에 적용됩니다.
// 타입은 집합이다!!!

// 그러므로 당연히 앞의 세가지보다 더 많은 속성을 가지는 값도 PersonSpan 타입에 속합니다.

// never - 공집합이 없다는 뜻

type U = keyof Person & keyof Lifespan; // never
type U2 = keyof (Person | Lifespan); // never
type U3 = Person | Lifespan;
type A3 = "A" & AB; // 'A'

// keyof (A&B) = (keyof A) | (keyof B)
// keyof (A|B) = (keyof A) & (keyof B)

export {};

// 조금 더 일반적으로 PersonSpan 타입을 선언하는 방법은 extends 키워드를 쓰는 것입니다.
interface Person2 {
  name: string;
}

interface PersonSpan2 extends Person2 {
  birth: Date;
  death: Date;
}

// PsersonSpan2는 Person2의 부분집합
// extends의 의미는 ~에 할당 가능한 / ~의 부분 집합 이라는 의미로 받아들여야 합니다.

// 서브 타입이라는 용어를 들어 봤을 겁니다. 어떤 집합이 다른 집합의 부분 집합이라는 의미입니다.

function getKey<K extends string>(val: any, key: K) {}
// K는 string의 부분집합!
// 타입 상속은 즉 집합이다.
// 집합이라고 생각하면 너무 쉽다. K는 리터럴 또는 리터럴의 유니온 또는 string 자신을 말한다.

// not assign to === 부분 집합이 아닙니다!

// unknown 은 전체 집합을 가리킨다.

/* Item 9 타입 단언보다는 타입 선언을 사용하기 */

// 타입 단언 : 강제로 타입을 지정했으니 타입 체커에서 오류를 무시하라고 하는 것
// 타입 선언문에서는 잉여 속성 체크가 동작했지만, 단언문에서는 적용하지 않습니다.

// 화살표 함수에서의 타입 선언

// Person[]이길 원하지만, {name:string}[] 으로 추론된다.
const people = ["alice", "bob", "jan"].map((name) => ({
  name,
}));

const people2 = ["alice", "bob", "jan"].map((name) => {
  const person: Person = { name };

  return person;
});

// 아래와 같이 선언해볼 수 있다.
const people3 = ["alice", "bob", "jan"].map(
  (name): Person => ({
    name,
  })
);

// 타입 단언은 언제 꼭 필요할까?
// 타입 체커가 추론한 타입보다 여러분이 판단하는 타입이 더 정확할 때 의미가 있습니다.
// 예를 들어, DOM 엘리먼트
// 타입스크립트가 알지 못하는 정보를 우리가 가지고 있을 때
// 또한 자주 쓰이는 non-null assertion을 사용해서 null이 아님을 단언

const el = document.getElementById("foo")!;

// 타입 단언도 무조건 동작하는 것은 아니다.
// 서브타입으로 단언해야 가능하다.
// 서브타입이 아닐때에는? unknown으로 한다.
// 모든 타입은 unknown의 서브타입이기 때문에 unknown이 포함된 단언문은 항상 동작합니다.
// @ISSUE: 서브 타입은 단언으로 할 수 있다고 하는데, unknown은 super type 이지 않나?

// 이렇게 unknown을 이용해 자유자재로 바꿀 수 있다.
const number2 = 3 as unknown as Person;

/* Item 10 객체 래퍼 타입 피하기 */
// string은 어떻게 객체 메소드를 가지는가
// 자바스크립트는 기본형과 객체 타입을 서로 자유롭게 변환합니다.
// string 기본형에 charAt과 같은 메소드를 사용할 때, 자바스크립트는 기본형을 String 객체롤 래핑하고, 메서드를 호출하고, 마지막에 래핑한 객체를 버립니다.

// String, Number, Boolean, Symbol, BigInt 가 모두 래퍼 객체이다.
// 이 래퍼 타입들 덕분에 기본 형값에 메서드를 사용할 수 있고, 정적 메서드도 사용할 수 있습니다.
// 그러나 보토은 래퍼 객체를 직접 생성할 필요는 없습니다.

// 타입스크립트는 기본형과 객페 래퍼 타입을 별도로 모델링합니다.

/* Item 11 잉여 속성 체크의 한계 인지하기 */

// 잉여속성 체크란 무엇인가?
// 언제 동작하는가?
// 구조적 타이핑 (sub-super)와의 차이점은?
// 왜 이런 설계가 나왔는가? - 구조적 타입 시스템의 한계

// 타입이 명시된 변수에 <객체 리터럴>을 할당할 때 타입스크립트는 해당 타입의 속성이 있는지, 그리고 그 외의 속성은 없는지 확인합니다.

interface Room {
  numDoor: number;
  ceilingHeightFt: number;
}

const r: Room = {
  numDoor: 1,
  ceilingHeightFt: 10,
  elephant: "present",
};

// Room 타입에 생뚱 맞게 elephant 속성이 있는 것이 어색하다.
// 구조적 타이핑 관점으로 ㅐㅇ각해보면 오류가 발생하지 않아야 한다. (sub-super 관계, 할당가능검사)

const obj = {
  numDoor: 1,
  ceilingHeightFt: 10,
  elephant: "present",
};

const r2: Room = obj;
// 이건 또 왜 되는가?

// 첫번째 예제는 구조적 타입 시스템에서 발생할 수 있는 중요한 종류의 오류를 잡을 수 있도록 잉여속성 체크라는 과정이 수행되었습니다.
// 잉여속성체크가 할당가능검사와는 별도의 과정이라는 것을 알아야 타입스크립트 타입 시스템에 대한 개념을 정확히 잡을 수 있다.

// 타입스크립트는 단순히 런타임에 예외를 던지는 코드에 오류를 표시하는 것뿐 아니라, 의도와 다르게 작성된 코드까지 찾으려고 합니다.

interface Options {
  title: string;
  darkMode?: boolean;
}

function createWindow(options: Options) {
  return 1;
}

// const var3 = {
//   title: "Sisyphe",
//   darkmode: true,
// };

// createWindow(var3);

createWindow({
  title: "Sisyphe",
  darkmode: true,
});

// darkmode는 Options에 없습니다.
// 구조적 타입 시스템은 이것을 허용하는데, 오타의 가능성이 크다.
// 구조적 타입 시스템의 한계

// 앞의 코드를 실행하면 런타임에 어떠한 종류의 오류도 발생하지 않습니다. 그러나 타입스크립트가 알려주는 오류 메시지처럼 의도한 대로 동작하지 않을 수 있습니다.
// Options 타입은 범위가 매우 넓기 떄문에 순수한 구조적 타입 체커는 이런 종류의 오류를 찾아내지 못 합니다.
// string 타입인 title 속성과 또다른 어떤 속성을 가지는 모든 객체는 Options 타입의 범위에 속합니다.

// 왜 이렇게 만들었을까?
// 변수로 넣었을 때 잉여속성체크를 왜 안해주는가?
// 객체리터럴만 잉여속성체크하는게 무슨 의미가 있는가?

// !변수 선언에서도 잉여속성체크를 하는 방법
type StrictPropertyCheck<T, TExpected, TError> = Exclude<
  keyof T,
  keyof TExpected
> extends never
  ? {}
  : TError;

interface Animal {
  speciesName: string;
  legCount: number;
}

function serializeBasicAnimalData<T extends Animal>(
  a: T & StrictPropertyCheck<T, Animal, "Only allowed properties of Animal">
) {
  // something
}

var weirdAnimal = {
  legCount: 65,
  speciesName: "weird 65-legged animal",
  specialPowers: "Devours plastic",
};
serializeBasicAnimalData(weirdAnimal); // now correctly fails

// - 타입스크립트의 두가지 역할
// - 런타임에 예외를 던지는 코드에 오류를 표시
// - 의도와 다르게 작성된 코드까지 찾으려고 한다 (ex. 잉여속성체크)

// 잉여 속성 체크는 구조적 타이핑 시스템에서 허용되는 속성 이름의 오타 같은 실수를 잡는 데 효과적인 방법입니다.
// 오직 객체 리터럴에만 적용됩니다. 이러한 한계점을 인지하고 잉여 속성 체크와 일반적인 타입 체크를 구분한다면, 두가지 모두의 개념을 잡는 데에 도움이 될 것입니다.

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

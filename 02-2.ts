export {};

/* 타입과 인터페이스의 차이점 알기 */
// 대부분의 경우 타입을 사용해도 되고 인터페이스를 사용해도 됩니다.
// 함수 타입도 인터페이스나 타입으로 정의할 수 있습니다.

type TFn = (x: number) => string;
interface Ifn {
  (x: number): string;
}

// 인터페이스는 유니온 타입 같은 복잡한 타입을 확장하지는 못한다.  (유니온 타입은 있지만, 유니온 인터페이스는 없다.)
// type 키워드는 일반적으로 interface 보다 쓰임새가 많습니다. type 키워드는 유니온이 될 수도 있고, 매핑된 타입 또는 조건부 타입 같은 고급 기능에 활용되기도 합니다.
// 튜플과 배열 타입도 type 키워드를 활용해 더 간겨라게 표현할 수 있습니다.
type Pair = [number, number];
// 인터페이스도 튜플과 비슷하게 구할 수 있기는 합니다.
interface Tuple {
  0: number;
  1: number;
  length: 2;
}
const t: Tuple = [10, 20];
// 그러나 인터페이스로 튜플과 비슷하게 구현하면 튜플에서 사용할 수 있는 concat 같은 메서드들을 사용할 수 없습니다.

// 반면 인터페이스는 타입에 없는 몇 가지 기능이 있습니다. 그 중 하나는 바로 보강(augment)이 가능하다는 것입니다.

interface IState {
  name: string;
  capital: string;
}

interface IState {
  population: number;
}

const wyoming: IState = {
  name: "Wyoming",
  capital: "Cheyenne",
  population: 500000,
};
// 이것이 가능하다!!

// 이 예제처럼 속성을 확장하는 것을 선언 병합 (declaration merging) 이라고 합니다.
// 선언 병합은 주로 타입 선언 파일에서 사용됩니다.
// 타입 선언에는 사용자가 채워야하는 빈틈이 있을 수 있는데, 바로 이 선언 병합이 그렇습니다. - Theme이 그랬구나!!

interface Theme {}

declare module "@emotion/react" {
  export interface Theme {
    abc: 3;
  }
}
// 이게 선언 병합이었구나.!

// 타입스크립트는 여러 버전의 자바스크립트 표준 라이브러리에서 여러 타입을 모아 병합합니다.
// 에를 들어, Array 인터페이스는 lib.es5.d.ts에 정의되어 있고, 기본적으로는 lib.es5.d.ts에 선언된 인터페이스가 사용됩니다.
// 그러나 tsconfig.json의 lib 목록에 ES2015를 추가하면 타입스크릅티는 lib.es2015.d.ts에 선언된 인터페이스를 병합합니다.
// 여기에는 ES2015에 추가된 또 다른 Array 선언의 find 같은 메서드가 포함됩니다. 이들은 병합을 통해 다른 Array 인터페이스에 추가됩니다.
// 결과적으로 각 선언이 병합되어 전체 메서드를 가지는 하나의 Array 타입을 얻게 됩니다.

// 결론 : 복잡한 타입이라면 고민할 것도 없이 타입 별칭을 사용하면 됩니다.

/* Item 14 타입 연산과 제네릭 사용으로 반복 줄이기 */
// 함수에서 매개변수로 매핑할 수 있는 값을 제한하기 위해 타입 시스템을 사용하는 것처럼 제네릭 타입에서 매개변수를 제한할 수 있는 방법이 필요합니다.
// 제네릭 타입에서 매개변수를 제한할 수 있는 방법은 extends를 사용하는 것입니다.

/* Item 16 number 인덱스 시그니처보다는 Array, 튜플, ArrayLink를 사용하기 */
// 자바스크립트 객체 모델에도 이상한 부분들이 있으며, 이 중 일부는 타입스크립트 타입 시스템으로 모델링되기 때문에 자바스크립트 객체 모델을 이해하는 것이 중요합니다.
// 자바스크립트에서 객체란 키/쌍의 모음입니다. 키는 보통 문자열입니다. (ES2015 이후로는 심벌일 수 있습니다.) 그리고 값은 어떤 것이든 될 수 있습니다.
// 만약 더 복잡한 객체를 키로 사용하려고 하면 toString 메서드가 호출되어 객체가 문자열로 변환됩니다.
// 특히, 숫자는 키로 사용할 수 없습니다. 만약 속성이름으로 숫자를 사용하려고 하면 자바스크립트 런타임은 문자열로 변환할 겁니다.

const x = {};
x[[1, 2, 3]] = 3;
// { '1,2,3':1}

// 추후 16장 다시 공부하고 적기

/* Item 17 변경 관련된 오류 방지를 위해 readonly 사용하기 */
// number[] 는 readonly number[] 보다 기능이 많기 때문에, readonly number[]의 서브타입이 됩니다.
// 따라서 변경 가능한 배열을 readonly 배열에 할당할 수 있습니다.

const a: number[] = [1, 2, 3];
const b: readonly number[] = a;
const d: number[] = b; // mutable에 readonly를 할당할 수 없다.

// readonly는 얕게 동작한다.

/* Item 18 매핑된 타입을 사용하여 값을 동기화하기 */

// shouldUpdate 함수는 값이 변경될 때마다 차트를 다시 그릴 것입니다.
// 이렇게 처리하는 것을 보수적 접근법(conservative) 또는 실패에 닫힌 (fail close) 접근법이라고 합니다.

const obj = {
  a: 1,
  b: 2,
  c: 3,
} as const;

// @ISSUE: 왜 타입스크립트는 타입을 넓게 만들었을까?
const c = Object.entries(obj);

type Entries<T> = {
  [K in keyof T]: [K, T[K]];
}[keyof T][];

const bbb = {
  a: ["a", 1],
  b: ["b", 1],
  c: ["c", 1],
} as const;

const TypedObjectEntries = <T extends {}>(obj: T): Entries<T> => {
  return Object.entries(obj) as Entries<T>;
};

const changedObj = TypedObjectEntries(obj).map((abc) => abc);

// union to array

type AAA = 1 | 2 | 3;

const TypedObjectKeys = <T extends {}>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

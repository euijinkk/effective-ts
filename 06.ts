/** Item 50 오버로딩 타입보다는 조건부 타입을 사용하기 */

export {};

function double(x) {
  return x + x;
}
// double에 string 이나 number가 매개변수로 들어온다.

// 안 되네
// 연산을 할 수 없다.
function double2(x: number | string): number | string {
  return x + x;
}

// 함수 오버로딩으로 해결
function double3(x: number | string): number | string;
function double3(x: any): any {
  return x + x;
}

// string | number로 선언할 수 있다.
const num = double3(12);
const num2 = double3("x");

// 제네릭을 사용해보기
function double4<T extends number | string>(x: T): T {
  return x + x; // T 타입끼리 연산ㅇ르 할 수가 없다.
}

// 제네릭을 사용해보기
function double5<T extends number | string>(x: T): T;
function double5(x: any) {
  return x + x;
}

const num3 = double5(12);
const num4 = double5("x"); // xx 가 나와야 하는데 x타입으로 추론된다.
// 타입이 과하게 구체적이다.

function double6(x: number): number;
function double6(x: string): string;
function double6(x: any) {
  return x + x;
}

// 오버로딩 하면, 위에서부터 탐색하여 적절한 것을 찾는다.
// 그러나 유연하지 못 하다.
function f(x: number | string) {
  return double6(x); // string | null 형식의 인수는 string 형식의 매개변수에 할당될 수 없습니다.
}

// 조건부 타입을 활용하자. 조건부 타입은 타입 공간의 if 문과 같다.
// 반환타입이 더 정교하다.
function double7<T extends number | string>(
  x: T
): T extends string ? string : number;
function double7(x: any) {
  return x + x;
}

// 함수 오버로딩이 작성하기는 쉽지만, 조건부 타입은 개별 타입의 유니온으로 일반화하기 때문에 타입이 더 정확해집니다.

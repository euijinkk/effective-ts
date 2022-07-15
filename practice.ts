// 의문 1. (미해결)
// 왜 Object.keys는 타입추론이 안되고 무조건 string[]을 반환할까
// 그냥 그렇게 타이핑 했기 때문?

type Person = {
  name: string;
  age: number;
  id: number;
};

declare const me: Person;

me.test = "c";
// name, age, id 이외에

type A = typeof me;
const b = Object.keys(me);
type B = typeof b;

Object.keys(me).forEach((key) => {
  // No index signature with a parameter of type 'string' was found on type 'Person'.(7053)
  console.log(me[key]);
});

// 2. 공변

interface SuperType {
  foo: number;
}
interface BaseType extends SuperType {
  bar: string;
}
interface SubType extends BaseType {
  baz: boolean;
}
declare let superTypeValue: SuperType;
declare let baseTypeValue: BaseType;
declare let subTypeValue: SubType;

// 공변 (타입스크립트에서 변수는 공변이다.)
baseTypeValue = superTypeValue; // 에러!
baseTypeValue = subTypeValue; // 허용

// https://younho9.dev/how-to-iterate-object-more-safely

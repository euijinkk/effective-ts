/* 4장 타입 설계 */

// 타입 시스템의 가장 큰 장점 중 하나는 데이터 타입을 명확히 알 수 있어 코드를 이해하기 쉽다는 것입니다.

// 누가 순서도를 보여 주면서 테이블을 감추면 나는 여전히 갸우뚱 할 거이다. 하지만 테이블을 보여준다면 순서도는 별로 필요하지 않다. 보지 않더라도 명백할 것이기 때문이다.
// 테이블(코드의 타입). 순서도(코드의 로직)

/* Item 28 유효한 상태만 표현하는 타입을 지향하기 */

// 웹에서 페이지를 선택하면, 페이지의 내용을 로드하고 화면에 표시합니다. 페에지의 상태는 다음처럼 설계했습니다.

interface State {
  pageText: string;
  isLoading: boolean;
  error?: string;
}

// 페이지를 그리는 renderPage 함수
function renderPage(state: State) {
  if (state.error) {
    return `Error! Unable to load: ${state.errors}`;
  } else if (state.isLoading) {
    return `Loading...`;
  }

  return `${state.pageText}`;
}
// 코드를 살펴보면, 분기 조건이 명확히 분리되어 있지 않다는 것을 알 수 있습니다.
// isLoading이 true이고 동시에 error 값이 존재하면 로딩 중인 상태인지 오류가 발생한 상태인지 명확히 구분할 수 없습니다. 필요한 정보가 부족하기 떄문입니다.

// 페이지를 전환하는 changePage 함수

async function changePage(state: State, newPage: string) {
  state.isLoading = true;

  try {
    const response = await fetch(getUrlForPage(newPage));
    if (!response.ok) {
      throw new Error();
    }
    const text = await response.text();
    state.isLoading = false;
    state.pageText = text;
  } catch (e) {
    state.error = "" + e;
  }
}
// 문제점
// 1. 오류가 발생했을 때 state.isLoading을 false로 설정하는 로직이 빠져있다.
// 2. state.error를 초기화하지 않았기 때문에, 페이지 전환 중에 로딩 메시지 대신 과거 의 오류 메시지를 보여주게 됩니다.
// 3. 페이지 로딩 중에 사용자가 페이지를 바꿔 버리면 어떤 일이 벌어질지 예상하기 어렵습니다. 새 페이지에 오류가 뜨거나, 응답이 노는 순ㄱ서에 따라 두번째 페이지가 아닌 첫번째 페이지로 전환될 수도 있습니다.

// 문제는 바로 상태 값의 두가지 속성이 동시에 정보가 부족하거나(요청이 실패한 것인지, 여전히 로딩중인지 알 수 없습니다), 두가지 속성이 충돌(오류이면서 동시에 로딩중)할 수 있다는 것입니다.
// State 타입은 isLoading이 true이면서 동시에 error 값이 설정되는 무효한 상태를 허용합니다.

// useFetch의 결과값을 구분하기. loading이면서, error인 상태를 가정하고 있다. loading, error이 아니라고 해서 값이 있다는 것을 보장할 수 없다.
// reducer 상태 설계 리팩터링

interface RequestPending {
  state: "pending";
}

interface RequestError {
  state: "error";
  error: string;
}

interface RequestSuccess {
  state: "ok";
  pageText: string;
}
type RequestState = RequestPending | RequestError | RequestSuccess;

interface State2 {
  currentPage: string;
  requests: { [pages: string]: RequestState };
}

// 여기서는 네트워크 요청 과정 각각의 상태를 명시적으로 모델링하는 태그된 유니온(구별된 유니온)이 사용되었습니다.
// 무효한 상태를 허용하지 않도록 개선
// 명시적으로 모델링

function renderPage2(state: State2) {
  const { currentPage } = state;
  const requestState = state.requests[currentPage];
  switch (requestState.state) {
    case "pending":
      return "Loading";
    case "error":
      return "Error";
    case "ok":
      return requestState.pageText;
  }
}

/* 유니온의 인터페이스 보다는 인터페이스의 유니온을 사용하기 */

// 유니온 타입의 속성을 가지는 인터페이스를 작성 중이라면, 혹시 인터페이스의 유니온 타입을 사용하는 게 더 알맞지는 않을지 검토해봐야 합니다.
interface Layer {
  layout: FillLayout | LineLayout | PointLayout;
  paint: FillPaint | LinePaint | pointPaint;
}
// layout이 LineLayout 타입이면서 paint 속성이 FillPaint 타입인 것은 말이 되지 않습니다.

// 더 나은 방법으로 모델링하려면 각각 타입의 계층을 분리된 인터페이스로 둬야 합니다.
// 이러한 패턴의 가장 일반적인 예시는 태그된 유니온 입니다.
// type 속성은 태그이며, 런타임에 어떤 타입의 layer가 사용되는지 판단하는데 쓰입니다. 타입스크립트는 태그를 참고하여 Layer의 타입의 범위를 좁힐 수도 있습니다.
interface FillLayer {
  type: "fill";
  layout: FillLayout;
  paint: FillPaint;
}

interface LineLayer {
  type: "line";
  layout: LineLayout;
  paint: LinePaint;
}

interface PointLayer {
  type: "point";
  layout: PointLayout;
  paint: PointPaint;
}
type Layer2 = FillLayer | LineLayer | PointLayer;

// 태그된 유니온은 타입스크립트 타입 체커와 잘 맞기 때문에 타입스크립트 코드 어디에서나 찾을 수 있습니다.
// 이 패턴을 잘 기억해서 필요할 때 적용할 수 있도록 해야합니다. 어떤 데이터 타입을 태그된 유니온으로 표현할 수 있다면, 보통은 그렇게 하는 것이 좋습니다.
// 또는 여러 개의 선택적 필드가 동시에 값이 있거나 동시에 undefined일 경우도 태그된 유니온 패턴이 잘 맞습니다.

interface Person2 {
  name: string;
  // 다음은 둘 다 동시에 있거나 동시에 없습니다.
  placeOfBirth?: string;
  dateOfBirth?: Date;
}

interface Person3 {
  name: string;
  birth?: {
    place: string;
    date: Date;
  };
}

// 타입의 구조를 손댈수 없는 상황(API 통신)이면, 앞서 다룬 인터페이스의 유니온을 사용해서 속성 사이의 관계를 모델링
interface Name {
  name: string;
}

interface PersonWithBirth extends Name {
  placeOfBirth: string;
  dateOfBirth: Date;
}

type Person4 = Name | PersonWithBirth;

function eulogize(p: Person4) {
  if ("placeOfBirth" in p) {
    p; // PersonWithBirth
    const { dateOfBirth } = p;
  }
}

/* Item 33 string 타입보다 더 구체적인 타입 사용하기 */

interface Album {
  artist: string;
  title: string;
  releaseDate: string; // YYYY-MM-DD
  recordingType: string; // live 또는 studio
}

type RecordingType = "studio" | "live";
interface Album2 {
  artist: string;
  title: string;
  releaseDate: Date;
  recordingType: RecordingType;
}

const albums: Album2[] = [
  {
    artist: "1",
    title: "2",
    releaseDate: new Date("1999-02-14"),
    recordingType: "studio",
  },
  {
    artist: "1",
    title: "2",
    releaseDate: new Date("1999-02-14"),
    recordingType: "studio",
  },
  {
    artist: "1",
    title: "2",
    releaseDate: new Date("1999-02-14"),
    recordingType: "studio",
  },
];

// _ 라이브러리의 pluck 함수
function pluck(records, key) {
  return records.map((r) => r[key]);
}

function pluck2<T>(records: T[], key: string): any[] {
  return records.map((r) => r[key]); // r에 key 가 없다.
}

function pluck3<T>(records: T[], key: keyof T) {
  return records.map((r) => r[key]);
}

pluck3(albums, "recordingType"); // (string | Date)[]
// 너무 넓다.

// 2번째 제네릭을 받자

function pluck4<T, K extends keyof T>(records: T[], key: K) {
  return records.map((r) => r[key]);
}

pluck4(albums, "recordingType"); // RecordingType[]

// string은 any와 비슷한 문제를 가지고 있습니다. 따라서 잘못 사용하게 되면 무효한 값을 허용하고 타입간의 관계도 감추어 버립니다.
// 이러한 문제저은 타입 체커를 방해하고 실제 버그를 찾찌 못하게 만듭니다.
// string의 부분집합을 정의할 수 있는 기능은 자바스크립트 코드에 타입 안전성을 크게 높입니다.
// 보다 정확한 타입을 사용하면 오류를 방지하고 코드의 가독성도 향상시킬 수 있습니다.

/* Item 37 공식 명칭에는 상표를 붙이기 */
type Meters = number & { _brand: "meters" };

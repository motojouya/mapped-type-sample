import { UndoRedoList }  from './UndoRedoList';

type Human = {
  name: string,
  age: number,
  married: boolean,
};

function mapObject<K extends string, T, U>(
  obj: {[P in K]: T},
  fn: (x: T, k?: K) => U
): {[P in K]: U};

function mapObject(obj, fn) {
  const returnObj = {};
  for (let prop in obj) {
    if (obj.hasOwnProperty(prop)) {
      returnObj[prop] = fn(obj[prop]);
    }
  }
  return returnObj;
}

function undoredoable<T>(val: T): UndoRedoList<T> {
  return new UndoRedoList<T>(val);
}

const munetaka: Human = {
  name: 'Takuya Sugiyama',
  age: 33,
  married: true,
};

const undoredoMap = mapObject(munetaka, undoredoable);

console.log(undoredoMap);
for (let prop in undoredoMap) {
  if (undoredoMap.hasOwnProperty(prop)) {
    console.log(undoredoMap[prop].current());
  }
}


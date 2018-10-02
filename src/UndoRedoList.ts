
type UndoRedoItem<T> = {
  data?: T,
  privious?: UndoRedoItem<T>,
  next?: UndoRedoItem<T>,
};

export class UndoRedoList<T> {

  private currentData: UndoRedoItem<T>;

  constructor(initialData: T) {
    this.currentData = {
      data: initialData,
      privious: null,
      next: null,
    };
  }

  add(data: T) {
    this.currentData.next = {
      data: data,
      privious: this.currentData,
      next: null,
    };
    this.currentData = this.currentData.next;
  };

  current(): T {
    return this.currentData.data;
  };

  undo(): T {
    this.currentData = this.currentData.privious;
    return this.currentData.data;
  };

  redo(): T {
    this.currentData = this.currentData.next;
    return this.currentData.data;
  };

  get undoable(): boolean {
    return !!this.currentData && !!this.currentData.privious;
  }

  get redoable(): boolean {
    return !!this.currentData && !!this.currentData.next;
  }

};

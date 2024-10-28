import { BehaviorSubject, Subscriber } from "rxjs";

export type ToastMessage = {
  type: "success" | "error" | "warning" | "info";
  message: string;
};

export class ToastService {
  private static _toasts = new BehaviorSubject<ToastMessage[]>([]);

  public static add(message: ToastMessage) {
    this._toasts.next([...this._toasts.getValue(), message]);
    setTimeout(() => {
      const [_, ...rest] = this._toasts.getValue();
      this._toasts.next(rest);
    }, 3000);
  }

  public static subscribe(subscribe: Subscriber<ToastMessage[]>) {
    this._toasts.subscribe(subscribe);
  }
}

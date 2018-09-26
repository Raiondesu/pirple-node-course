export namespace Router {
  export type RoutePayload<T> = {
    status?: number;
    payload?: T;
  };

  export type Handler<T = any> = ((data: any) => Promise<RoutePayload<T>> | {});

  export type HandlerWithChildren<T extends undefined | {
    [child: string]: HandlerWithChildren;
  } = any> = T extends undefined ? Handler : (Handler & T);

  export interface ITree {
    [handler: string]: HandlerWithChildren;
  }
}

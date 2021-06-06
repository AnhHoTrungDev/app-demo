import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const now: number = Date.now();
    // const actionType = String(context['args'][3].parentType);
    // const functionName = String(context.getArgs()[3].fieldName);
    // const arrayAction: string[] = ['Query', 'Mutation'];

    // return next.handle().pipe(
    //   tap(() => {
    //     this.showLogAction(actionType, functionName, now);
    //     if (arrayAction.indexOf(actionType) > -1)
    //       this.showTimeFinishAction(actionType, now);
    //   }),
    //   catchError((error) => {
    //     this.showLogAction(actionType, functionName, now);
    //     this.showLogError(error);
    //     return throwError(error);
    //   }),
    // );

    const req: Request = context.switchToHttp().getRequest();
    const { method, url, body, headers } = req;
    console.log('body :>> ', body);

    return next.handle().pipe(
      tap(() => {
        this.showLogAction(method, url, now);
      }),
      catchError((error) => {
        console.log('  return throwError(error); :>> ', error);
        this.showLogAction(method, url, now);
        this.showLogError(error);
        return throwError(error);
      }),
    );
  }

  /**
   * show log action type, function name, time exe and date time.
   */
  public showLogAction(actionType: string, functionName: string, now: number) {
    console.log(
      '🚀',
      `\x1b[32m[${actionType}]\x1b[0m`,
      '»',
      functionName,
      `\x1b[33m[+${Date.now() - now}ms]\x1b[0m`,
      new Date().toLocaleString(),
      '👌',
    );
    return;
  }

  /**
   * show log time finish action
   */
  public showTimeFinishAction(actionType: string, now: number) {
    console.log(
      '💻',
      `\x1b[32m[Interceptor: ${actionType} finished in ${
        +new Date() - now
      }ms]\x1b[0m`,
      '😁',
    );
    return;
  }

  /**
   * show log error
   */
  public showLogError(error: any) {
    console.error(
      '❌',
      `\x1b[31m[Interceptor: ${(error + '').replace(
        /(Error: |Authentication|UserInputError: )+/g,
        '',
      )}]\x1b[0m`,
      '😢',
    );
    return;
  }
}

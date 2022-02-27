# Nest.js Boilerplate
[![Build Status](https://travis-ci.org/uzysjung/UzysHapiSkeleton.svg?branch=master)](https://travis-ci.org/uzysjung/UzysHapiSkeleton)


## Start Guide
`package.json`의 `scripts`를 참조할 수 있습니다.
```
npm install
npm run prepare

```

### HTTP Server frameworks
`Express`를 사용합니다.
성능을 위해 Fastify가 검토 될 수 있습니다만, 범용성이 떨어지므로 Express를 사용합니다.

### API Versioning
uri-versioning을 통해서 API Version을 관리합니다.
```
app.setGlobalPrefix(environmentService.get<string>('API_VERSION'), {
  exclude: [''],
});
 
app.enableVersioning({
  type: VersioningType.URI,
});
```

### Code Convention
eslint와 tsconfig, pretter를 통해 코드 컨벤션을 관리합니다. 기본 Tab은 space 2칸을 사용합니다.

tsconfig와 eslint를 통해 File Name, Code style, naming-convention 등을 적용합니다. 적용된 Rule은 개발 과정에서 추가되거나 삭제될 수 있습니다.

Code Convention의 목표는 코드 스타일을 통일함으로써 코드의 가독성을 높이고 사소하지만 개발자에게 중요한 논쟁들을 해결함에 있습니다. 
```
'@typescript-eslint/naming-convention': [
    'error',
    {
        selector: 'default',
        format: ['camelCase', 'PascalCase', 'snake_case', 'UPPER_CASE'],
        filter: {
            regex: '^_.*$',
            match: false,
        },
    },
    {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
    },
    {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
    },
    {
        selector: 'typeLike',
        format: ['PascalCase'],
    },
    {
        selector: 'memberLike',
        modifiers: ['private'],
        format: ['camelCase'],
        leadingUnderscore: 'forbid',
    },
    {
        selector: 'variable',
        types: ['boolean'],
        format: ['PascalCase'],
        prefix: ['is', 'should', 'has', 'can', 'did', 'will'],
    },
],
```

### Git Convention
husky를 통해 hook을 관리합니다.

Git Convention은 Repository에 코드를 관리함에 있어서 코드의 품질을 견고하게 관리함에 있습니다.

| hook | Description |
| -- | ------ |
| commit-msg | conventional commit format |
| pre-push | Lint와 Test를 수행합니다. |

commit 시 Message의 일관성을 유지시켜주며, Git Push 전 Lint와 Unit Test, E2E Test를 통해 PR 단위로 테스트 케이스를 검증합니다.

> Repository에서 PIPE LINE, CI/CD에서 제공이 된다면 pre-push는 이전될 수 있으며, 개발 과정에서 Build Test가 추가될 수 있음.

### Directory

Nestjs의 장점은 재 사용 가능한 최소 단위인 Module로 서비스를 관리하는데 있다.
Layered Architecture가  Module 단위로 나뉨으로써 Mircro Service Architechture로서의 전환을 쉽게 달성 할 수 있고,
Module 단위의 기능들이 자신의 도메인내에서 충실함으로써 코드의 재사용성과 서비스가 커지더라도 관리가 용이한 장점이 있다.

이러한 구조에 따라 Module을 별도의 폴더로 분리하였고 그 외의 공통 기능은 각각의 폴더로 정의합니다. 

서비스가 커짐에 따라 module 들이 늘어날 것이고, module 이하 폴더가 증가될 것이다.

공통으로 참조되는 객체들은 최상위에서 각 기능별로 참조될 것이다.

module 내에서는 DTO(Data Transfer Object)만 하위 폴더로 구성하며,

e2e Test(End to End, xx.e2e.spec.ts)와 Unit Test(xx.spec.ts) 모두 module 내에 위치하도록 합니다.

별도의 폴더로 분리하여 배포시에 제외하는 경우도 있지만,
개발 과정에서 테스트 파일이 별도로 분리되는 경우 누락되는 경우가 많아 같은 공간에서 존재하도록 합니다.

DTO의 경우 Module의 주체가 소유하는 것을 기본으로 한다.

> 단일 서비스임에 따라 libraries로 분리는 하지 않았으며, 향후 여러 서비스에서 재 사용될 경우 라이브러리의 분리를 고려해볼 수도 있다.

### Environment
서비스를 구성하는데 있어서 Port, 외부 서비스 URL등 환경설정은 공통적인 기능중에 하나이다.

NestJS에서는 이러한 ConfigService를 기본 Module로 제공하고 있으며 custom-validate-function을 제공하고 있다.

이를 통해 잘못된 환경 설정의 휴먼 에러를 사전에 방지하고 관리할 수 있도록 해준다.

`environment/environment.validation.ts`에서 기본값과 규칙 등을 class-validator와 class-transformer을 통해 정의한다.

코드 내에서 EnvironmentService를 통해 값을 사용할 수 있으며, custom-getter-functions 또한 여기에서 정의한다.

get 함수를 통해 EnvironmentVariables에 정의된 환경 변수를 참조할 수 있다. EnvironmentService는 inject하여 사용할 수 있습니다.

### Logger
Nest.js 기본 Logger를 사용하며, Express 요청에 대해서 로그로 남기기 위해 `morgan`을 사용합니다.
```
app.use(
  morgan(configService.get<string>(envName('HTTP_LOG_FORMAT')), {
    skip(_req: IncomingMessage, res: ServerResponse) {
      return isProduction ? res.statusCode < 400 : false;
    },
    stream: {
      write: (message: string) => {
        Logger.log(message.replace('\n', ''), LogType.Http);
        return true;
      },
    },
  }),
);
```
Production Level에서 statusCode 400 미만의 Http 응답은 기록하지 않습니다

Error Log는 Sentry에 기록됩니다.
```
@Injectable()
export class SentryInterceptor implements NestInterceptor {
  intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        Sentry.captureException(error);
        // eslint-disable-next-line unicorn/no-null
        return null;
      }),
    );
  }
}
```

### Security
웹 취약점(web vulnerabilities)으로부터 보호하기 위해 `helmet`을 사용합니다. 

`cors(Cross-origin resource sharing)`를 허용합니다.

`CSRF` Protection을 사용합니다.
```
const app = await NestFactory.create<NestExpressApplication>(
  MainModule,
  new ExpressAdapter(),
  { cors: true },
);
 
app.use(
  helmet({
    contentSecurityPolicy: false,
  }),
);
 
app.use(csurf());
```

### Documentation
API Documentation으로 swagger를 사용합니다. setup-swagger.ts에서 세부 설정을 관리합니다.

swagger는 Production 환경이 아닌 경우만 제공됩니다.

### Http Module
Nestjs에서 제공하는 http-module을 사용합니다. 

HttpService가 Observable 타입으로 관리되나, 기본적으로 Promise로 노출하여 사용할 수 있도록 한다.
```
async getPassList(
  propertyId: string,
  params?: {
    spaceId?: string;
    bookingId?: string;
    activate?: boolean;
    page?: number;
    size?: number;
  },
): Promise<PassDto[]> {
  const passList$: Observable<ResponsesListDto<PassDto>> = this.httpService
    .get<ResponsesListDto<PassDto>>(`v2/properties/${propertyId}/passes`, {
      params,
    })
    .pipe(
      map(
        (axiosResponse: AxiosResponse) =>
          axiosResponse.data as ResponsesListDto<PassDto>,
      ),
      catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }),
    );
  const { data } = await lastValueFrom(passList$);
  return data.list;
}
```


### Test
Jest와 Supertest를 통해 testing을 구현하고 관리합니다.

목표 커버리지는 Statements 60% 입니다.

- Statements: 전체 코드 중 명령문이 몇 개이고 얼마나 실행되었는가?
- Branches: 전체 코드 중 분기문이 몇 개이고 얼마나 실행되었는가?
- Functions: 전체 코드 중 함수가 몇 개이고 얼마나 실행되었는가?
- Lines: 전체 코드 라인이 몇 개이고 얼마나 많이 실행되었는가?
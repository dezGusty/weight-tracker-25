# Guidelines for Angular

## Front-end process

There is no need to run `ng build` manually. The `ng serve` command handles building and serving the application during development. It shall be assumed that the developer has already started a dedicated terminal for the frontend with `ng serve`.

## UI guidelines

Use a consistent color scheme and typography throughout the application.
Ensure that the user interface is responsive and works well on different screen sizes.
Provide clear navigation and user feedback for all actions.

## Angular specifics

Prefer modern Angular syntax and features.
Consider that the default supported behavior should be that of a zoneless approach (components have the setting `changeDetection: ChangeDetectionStrategy.OnPush`).

### Control flow

Prefer using the modern `@for`, `@if`, etc blocks instead of the old `ngIf`, `ngFor`, etc directives (available since Angular 17).
E.g.

✅Prefer this

```html
@if(verifyColumnExistence('GID')) {
    <td>{{ advancedReport.employee.gid }}</td>
}
```

❌Try to avoid old syntax

```html
<td *ngIf="verifyColumnExistence('GID')">{{ advancedReport.employee.gid }}</td>
```

### Data retrieval

Prefer using signals and rxjs observables in order to manage state.
Interop functions should allow these to be combined easily:

E.g.

```ts
import { toSignal } from "@angular/core/rxjs-interop";
//...
protected readonly questionIdSig: Signal<string> = toSignal(this.questionId$, {
    initialValue: "",
  });
```

### Correctness

Avoid the use of any where possible. Use dedicated types and interfaces to define expected data.

### Dependencies

Prefer using the newer `inject` function as opposed to constructor-based injection.

E.g.

✅Prefer this

```ts
@Component()
export class MyComp {
    private service = inject(MyService);
    readonly token = inject(DI_TOKEN, { optional: true });
}
```

❌Try to avoid old syntax

```ts
@Component()
export class MyComp {
    constructor(
        private service: MyService,
        @Inject(DI_TOKEN) @Optional() readonly token: string){
    }
}
```

### Forms

Prefer using Signal Forms, available starting with Angular 21.

E.g.
Create form model with `signal()`

```ts
interface LoginData {
  email: string;
  password: string;
}
const loginModel = signal<LoginData>({
  email: '',
  password: '',
});
```

Pass the form model to form() to create a FieldTree

```ts
const loginForm = form(loginModel);
// Access fields directly by property name
loginForm.email
loginForm.password
```

Bind HTML inputs with the `[field]` directive

```html
<input type="email" [field]="loginForm.email" />
<input type="password" [field]="loginForm.password" />
```

Read field values with `value()`

```ts
// Get the current value
const currentEmail = loginForm.email().value();
```

Update field values with `set()`

```ts
// Update the value programmatically
loginForm.email().value.set('<sam.ple@test.com>');
```

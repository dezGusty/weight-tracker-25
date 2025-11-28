# .NET guidelines

Favor the usage of function return types which provide Results, or Maybe instead of throwing exceptions.

Favor using the library `CSharpFunctionalExtensions` (<https://www.nuget.org/packages/CSharpFunctionalExtensions>) by Vladimir Khorikov, which provides the `Result<T>` type.

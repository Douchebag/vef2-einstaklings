## Skilyrði og efnistök
1. Bakendi: Hono + TS (Node.js)
2. Framendi: React + Vite
3. Db: PostgreSQL
4. Validation: Zod
5. Tests: Node.js
6. Hýsing: Líklegast Render

## Verkplan
### Vika 6-7
* Setja upp repo og grunn build
* Setja upp Postgres
* Búa til Hono API beinagrind (/api/scenario/new, /api/attempt, /api/stats)
* React beinagrind

### Vika 8-9
* Scenario generator: random hole spil + flop + pot + bet og tryggja engin duplicate spil
* implementa /api/scenario/new og tengja við "New hand" takka
* implementa /api/attempt með pot odds og vista attempt í db
* UI sýnir feedback (required eq + fold/call) og streak teljara

### Vika 10-11
* Monte Carlo equity (random villain hand + turn og river)
* Hand evaluation tengt inn í eq reikning
* uppfæra api/attempt til að skila estimatedEq, requiredEq, correct og explanation[]
* Skrifa eitthva[ test með Node test runner


### Vika 12
* /api/stats útfært: accuracy, síðustu attempts, basic breakdown
* Stats UI

### Vika 13-14
* Betrumbæta UI
* Github actions (lint og test)
* Deploya á render


### Vika 15
* Skrifa skýrslu
* Mögulega difficulty stillingu ef það er tími


## Matskvarði
1. Trainer-virkni - 30%
2. Equity/pot-odds rökfræði - 25%
3. Gagnagrunnir og stats - 20%
4. Prófanir (Test runner og lint) - 15%
5. Hýsing, Github Action og Readme - 10%


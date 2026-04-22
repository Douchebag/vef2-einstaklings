# vef2-einstaklings
[Render Link](https://vef2-einstaklings-g7no.onrender.com)
## Inngangur

Í fyrra bjó ég til python forrit sem las spilin sem ég var með á hendi, hvaða spil væru á borðinu og hversu mörgum ég væri að spila á móti þegar ég var að spila á PokerStars appinu.
Forritið gerði svo sömu reikninga og ég er að gera hérna til að hjálpa með að taka ákvarðanir, þetta á samt einungis við í Cash Games og er eiginlega alveg tilgagnslaust á mótum.
Ég vildi bara búa til smá vefsíðu til að æfa mig í að gera reikningana sjálfur.

## Útfærsla

- **Bakendi:** Hono vefþjónn á Node.js sem býður upp á þrjú endpoint — `/api/scenario/new` býr til nýja aðstöðu, `/api/attempt` tekur á móti ákvörðun og skilar niðurstöðu, og `/api/stats` skilar tölfræði yfir allar tilraunir.
- **Framendi með React:** Framendi sem sýnir spilin, pot og bet, fold/call takka, og endurgjöf eftir hverja ákvörðun. Stats síða sýnir accuracy, breakdown (shouldCall/shouldFold) og nýlegar tilraunir.
- **Gagnagrunnur:** PostgreSQL með Prisma. Scenario og Attempt töflur halda utan um allar aðstæður og tilraunir. 
- **Prófanir:** Node.js innbyggði test runner (`node:test` + `node:assert/strict`).

## Tækni

- **Bakendi:** Hono + TypeScript (Node.js) | Létt og hratt. Auðvelt að setja upp route-a og middleware.
- **Framendi:** React + Vite + TypeScript | React því Óli sýndi það í áfanganum og það virkar vel. Vite gefur hraðan dev server.
- **Gagnagrunnur:** PostgreSQL + Prisma | PostgreSQL er þægileg sql týpa og Prisma gerir schema management og fyrirspurnir einfaldar.
- **Validation:** Zod | Schema validation sem fellur vel inn í TypeScript.
- **Hand evaluation:** pokersolver | Tilbúið safn sem metur pókerhendur.
- **Equity:** Monte Carlo Simulations | Raunhæf nálgun til að meta equity án þess að reikna allar mögulegar útkomur.
- **Prófanir:** Node.js test runner | Innbyggt í Node.

## Hvað gekk vel

- **Monte Carlo útreikningurinn** virkar vel. 1000 simulations gefa nógu nákvæma niðurstöðu og er nógu hratt til að viðmótið svari fljótt.
- **Streaks teljarinn** var mjög einfalt að útfæra
- **Prisma schema** reyndist þægilegt. Scenario og Attempt með relation á milli, migrations virkuðu vel frá byrjun

## Hvað gekk illa

- **pokersolver** safnið er gamalt og þurfti smá workaround til að virka í TS.
- **Tímaáætlun** reyndist erfiðari en ég bjóst við. Hefði mátt halda mig betur við áætlunina en útaf miklu álagi var það ekki hægt.

## Hvað var áhugavert

- Að læra hvernig poker reikningurinn og Monte Carlo sims væru útfærðir í vefforritun.
- Að tengja saman bakenda og framenda í real-time flæði þar sem notandinn fær strax endurgjöf á ákvörðunum sínum.

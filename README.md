[![Build and test](https://github.com/Smalandaren/Naturguiden/actions/workflows/dotnet.yml/badge.svg?branch=main)](https://github.com/Smalandaren/Naturguiden/actions/workflows/dotnet.yml)

### Hostad version: https://naturguiden.net

# Naturguiden

Denna README beskriver hur du startar Naturguiden.

## Krav

Följande program/verktyg måste installeras på datorn som ska köra prototypen.

- [Git Bash](https://git-scm.com/downloads) version 2.47.1 eller högre

- [Node.js](https://nodejs.org/) version 20.9.0 eller högre

- [NPM](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm) version 10.1.0 eller högre

- [Microsoft .NET Framework 8.0](https://dotnet.microsoft.com/en-us/download)

- [PostgreSQL 17](https://www.postgresql.org/download/) (kan funka med lägre och högre versioner, egen risk)

- [pgAdmin 4](https://www.pgadmin.org/download/) (ej krav men starkt rekommenderat för att följa denna readme)

## Beskrivning av strukturen

I detta repository finns 2st mappar:

- **Frontend** (här finns ett Next.js/React projekt som driver själva hemsidan)
- **Backend** (här finns en .NET Core projekt som driver vårt API)

En fil med namnet `naturguiden_db_FINAL.backup` finns i den inlämnade .zip-filen som du kommer använda för att återskapa vår databas på din egna dator.

## Skapa databasen

> [!NOTE]  
> Vi rekommenderar att du skapar databasen lokalt på din egna dator. Det vill säga, att du inte använder MAU postgres server.

1. Skapa en ny databas i pgAdmin:
2. Högerklicka på Databaser → Create → Database
3. Namnge den t.ex. naturguiden_db (eller valfritt namn).
4. Klicka på Save.
5. Högerklicka på naturguiden_db → "Restore"
6. Välj filen `naturguiden_db_FINAL.backup`.
7. Klicka på Restore.

####

Nu ska din databas förhoppningsvis innehålla 11 st tables

## Skapa back-end

1. Navigera till `Backend` foldern och öppna en terminal (Git bash förslagsvis) där
2. Slå commandot `dotnet restore`
3. Slå commandot `dotnet build`
4. Slå commandot `dotnet run`

####

Får du inga error meddelanden så här långt finns det goda förhoppningar för att du kommer lyckas. Men det finns ett viktigt steg kvar innan back-end biten fungerar.

Öppna filen `appsettings.json`. Här ska du leta efter en nyckel som heter `DefaultConnection` som kommer innehålla en tom sträng. Du ska ersätta den tomma strängen med en "connection string" till databasen som du skapade tidigare.

Du kan använda mallen för en connection string här nedan. Du måste ersätta vissa delar av den:

`Host=localhost;Database=<DATABAS_NAMN_HÄR>;Username=<DATABAS_ANVÄNDARNAMN_HÄR>;Password=<DATABAS_LÖSENORD_HÄR>`

_Hint: om du inte vet ditt postgres username, testa då "postgres" som username._

Spara filen `appsettings.json`.

Nu behöver du populera backenden med några bilder på naturplatser som medföljer inlämningen av projektet:

1. I den inlämnade .zip-filen med kod finns en folder "uploads".
2. Placera hela den foldern i mappen Backend/wwwroot. Om där redan finns en "uploads"-folder, ersätt den.
3. Kontrollera att "uploads" foldern innehåller bilder.

Slutligen:

1. Slå commandot `dotnet build`
2. Slå commandot `dotnet run`

####

Nu är servern igång.

## Skapa front-end

1. Navigera till `Frontend` foldern
2. Skapa en ny fil och döp den till `.env`
3. Lägg in följande rad i `.env`-filen: `NEXT_PUBLIC_API_URL="http://localhost:5112/api"`
4. Öppna en terminal (Git bash förslagsvis)
5. Slå commandot `npm i`
6. Slå commandot `npm run dev`

####

Nu är web-servern igång.

#

Om allt fungerat kan du nu öppna en webläsare och navigera till http://localhost:3000 varifrån du kan använda Naturguiden.

> [!IMPORTANT]
> Kommunikation mellan frontend och backend via HTTPS är möjligt i din lokala miljö. För den används port 7005 på backend. Genom denna kan du nå en sida som visar våra API endpoints https://localhost:7055/scalar/v1

> [!IMPORTANT]
> Google inloggning kommer inte fungera då det kräver credentials till Google Cloud som vi inte kan lämna ut.

> [!IMPORTANT]
> Hemsidan kommer kännas väldigt långsam när du navigerar mellan sidor. Detta är eftersom du kör hemsidan i development mode. Om du önskar köra hemsidan i production mode behöver du [bygga projektet](https://nextjs.org/docs/app/building-your-application/deploying).

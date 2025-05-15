Naturguiden Sprint 2
Denna README beskriver hur du startar Naturguiden.

Krav
Följande program/verktyg måste installeras på datorn som ska köra prototypen.

Git Bash version 2.47.1 eller högre

Node.js version 20.9.0 eller högre

NPM version 10.1.0 eller högre

Microsoft .NET Framework 8.0

PostgreSQL 16 (kan funka med lägre och högre versioner, egen risk)

pgAdmin 4 (ej krav men starkt rekommenderat för att följa denna readme)

Beskrivning av strukturen
I detta repository finns 2st mappar:

Frontend (här finns ett Next.js/React projekt som driver själva hemsidan)
Backend (här finns en .NET Core projekt som driver vårt API)
samt en fil naturguiden_db_sprint_2.backup som du kommer använda för att återskapa vår databas på din egna dator.

Skapa databasen
Note

Vi rekommenderar att du skapar databasen lokalt på din egna dator. Det vill säga, att du inte använder MAU postgres server.

Skapa en ny databas i pgAdmin:
Högerklicka på Databaser → Create → Database
Namnge den t.ex. naturguiden_db (eller valfritt namn).
Klicka på Save.
Högerklicka på naturguiden_db → "Restore"
Välj filen naturguiden_db_sprint_2.backup.
Klicka på Restore.
Nu ska din databas förhoppningsvis innehålla 11 st tables

Skapa back-end
Navigera till Backend foldern och öppna en terminal (Git bash förslagsvis) där
Slå commandot dotnet restore
Slå commandot dotnet build
Slå commandot dotnet run
Får du inga error meddelanden så här långt finns det goda förhoppningar för att du kommer lyckas. Men det finns ett viktigt steg kvar innan back-end biten fungerar.

Öppna filen appsettings.json. Här ska du leta efter en nyckel som heter DefaultConnection som kommer innehålla en tom sträng. Du ska ersätta den tomma strängen med en "connection string" till databasen som du skapade tidigare.

Du kan använda mallen för en connection string här nedan. Du måste ersätta vissa delar av den:

Host=localhost;Database=<DATABAS_NAMN_HÄR>;Username=<DATABAS_ANVÄNDARNAMN_HÄR>;Password=<DATABAS_LÖSENORD_HÄR>

Hint: om du inte vet ditt postgres username, testa då "postgres" som username.

Spara filen appsettings.json.

Slå commandot dotnet build
Slå commandot dotnet run
Nu är servern igång.

Skapa front-end
Navigera till Frontend foldern
Skapa en ny fil och döp den till .env
Lägg in följande rad i .env-filen: NEXT_PUBLIC_API_URL="http://localhost:5112/api"
Öppna en terminal (Git bash förslagsvis)
Slå commandot npm i
Slå commandot npm run dev
Nu är web-servern igång.

Om allt fungerat kan du nu öppna en webläsare och navigera till http://localhost:3000 varifrån du kan använda Naturguiden.

Important

Hemsidan kommer kännas väldigt långsam när du navigerar mellan sidor. Detta är eftersom du kör hemsidan i development mode. Om du önskar köra hemsidan i production mode behöver du bygga projektet.

Readme skriven av
Thor Anderberg Nilsson (discord: thoranilsson)

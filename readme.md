# 19.12.2023
## Что сделано
Начал писать модлуль под M1, а также модули под отправку и прием сообщений от rabbit. Добавил проверку на существование соединения в функции produceMessage в модуле M1.
Таким образом при попытке отправки сообщений с нескольких сервисов код не падает.

## TODO
~~Из-за проверки на существование подключения нашлась проблема, из-за которой при добавлении нескольких сервисов на отправку сообщений спамит кучей подключений. !!Придумать как исправить!!~~ - Пофиксил добавлением нового метода для получения инстанса в одном месте
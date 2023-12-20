## Локальное развертывание проекта
1. После клонирования проекта для запуска требуется установаить необходимые пакеты, для этого нужно использовать команду npm i  
2. Запуск программы осуществляется путем запуска команды npm run start в терминале
Проект писался на версии Node 18.17.0

### Установка RabbitMQ и Erlang
Также для корректной работы RabbitMQ необходима версия RabbitMQ Server 3.12.10, а также Erlang версии 26.1.2  
Ссылка на раздел документации для скачивания RabbitMQ Server - https://www.rabbitmq.com/download.html  
Ссылка для скачивания Erlang - https://www.erlang.org/patches/otp-26.1.2
### Общие сведения
Приложение запускается на порте 3000. Для проверки основного функционала необходимо отправить запрос на localhost:3000/double. В консоли будут отображаться сопроводительные логи, описывающие этапы работы программы  
POST запрос должен иметь следующий формат: {"num": число}. На выходе дается объект вида {"result": число * 2}  

Отлов ошибок реализован через try... catch..., ошибки выводятся в консоль с помощью console.error().

Приложение тестировалось через insomnia

# User Management Service

## Описание

Сервис для управления пользователями, реализующий регистрацию, аутентификацию (JWT), и CRUD операции с ролевой моделью доступа (Admin/User).

## Технологический стек

- **Runtime**: Node.js v24
- **Язык**: TypeScript
- **Фреймворк**: Express v5
- **База данных**: PostgreSQL
- **ORM**: Drizzle ORM
- **Валидация**: Zod
- **Логирование**: Pino
- **Тестирование**: Vitest + Supertest
- **Контейнеризация**: Docker + Docker Compose

## Функционал

1.  **Регистрация**: Создание нового пользователя.
2.  **Аутентификация**: Вход по Email/Password, выдача Access и Refresh токенов.
3.  **Профиль**: Получение профиля (Своего или любого для админа).
4.  **Список**: Получение списка пользователей (Только админ).
5.  **Блокировка**: Блокировка пользователя (Админ или сам пользователь).

## Запуск проекта

### Требования

- Docker & Docker Compose
- Node.js v24+ (для локальной разработки)
- pnpm

### Запуск через Docker (Production Mode)

Сборка и запуск приложения и базы данных:

```bash
pnpm dc:prod
```

Остановка:

```bash
pnpm dc:stop
```

Удаление контейнеров:

```bash
pnpm dc:down
```

### Локальная разработка

1. Необходимо создать .env файл в корне проекта на примере .env.example

2. Выполенить команды:

```bash
# установка зависимостей
pnpm install
# запуск БД
pnpm dc:dev
# запуск сервера
pnpm dev
```

### Тестирование и утилиты

Тесты

```bash
pnpm test
```

Линтинг и формат

```bash
pnpm format
pnpm lint
```

> [!CAUTION]
> Важно: Тесты используют ту же базу данных, что и dev окружение, но очищают таблицу users перед каждым запуском.

## API Endpoints

### Auth

- `POST /auth/register` - Регистрация
  - Body: `{ full_name, birth_date, email, password }`
- `POST /auth/login` - Вход
  - Body: `{ email, password }`
- `POST /auth/refresh` - Обновление токена
  - Body: `{ refreshToken }`

### Users

- `GET /users` - Список пользователей (Admin only)
- `GET /users/:id` - Профиль пользователя (Admin или владелец)
- `PATCH /users/:id/block` - Блокировка (Admin или владелец)

## Структура проекта

```
src/
├── config/         # Конфигурация и валидация env
├── database/       # Схема БД, миграции, подключение
├── errors/         # Кастомные ошибки
├── helpers/        # Утилиты (catchAsync)
├── lib/            # Библиотеки (jwt, password, logger)
├── middlewares/    # Middleware (auth, role, error, validate)
├── modules/        # Бизнес-логика (controllers, services, repositories)
│   ├── auth/
│   └── users/
├── app.ts          # Инициализация Express
└── server.ts       # Точка входа
```

## Улучшения (TODO)

Возможные направления развития проекта:

1. Swagger: Добавить автогенерацию документации API.
2. Убрать проверку через БД в auth middleware.
3. CI/CD: Базовый линт/тайпчек/билд на пуш

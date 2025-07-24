# Etapa 1: compilación
FROM php:8.2-fpm AS build

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libonig-dev curl zip libpng-dev libjpeg-dev libfreetype6-dev libpq-dev \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip mbstring exif pcntl bcmath gd pgsql

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www

COPY . .

RUN composer install --no-dev --optimize-autoloader

# Etapa 2: producción
FROM php:8.2-fpm

RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pgsql

COPY --from=build /var/www /var/www

WORKDIR /var/www

ENV PORT=10000

EXPOSE 10000

CMD php artisan serve --host=0.0.0.0 --port=$PORT

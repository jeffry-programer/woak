# Etapa 1: compilación
FROM php:8.2-fpm AS build

# Instala dependencias del sistema necesarias
RUN apt-get update && apt-get install -y \
    git unzip curl zip libzip-dev libonig-dev libpng-dev libjpeg-dev libfreetype6-dev libpq-dev gnupg \
    && docker-php-ext-configure zip \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql zip mbstring exif pcntl bcmath gd pgsql

# Instala Node.js 18
RUN curl -fsSL https://deb.nodesource.com/setup_18.x | bash - \
    && apt-get install -y nodejs

# Copia Composer desde imagen oficial
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Define directorio de trabajo
WORKDIR /var/www

# Copia el proyecto
COPY . .

# Instala dependencias PHP
RUN composer install --no-dev --optimize-autoloader

# Instala dependencias frontend y compila los assets con Vite
RUN npm install && npm run build

# Etapa 2: producción
FROM php:8.2-fpm

# Instala extensiones necesarias para PostgreSQL
RUN apt-get update && apt-get install -y libpq-dev \
    && docker-php-ext-install pdo pdo_mysql pdo_pgsql pgsql

WORKDIR /var/www

# Copia todo desde el build
COPY --from=build /var/www /var/www

ENV PORT=10000

EXPOSE 10000

# Ejecuta Laravel en el puerto configurado
CMD php artisan serve --host=0.0.0.0 --port=$PORT

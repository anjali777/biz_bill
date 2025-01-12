FROM php:7.4-apache

# Install necessary extensions, including pdo_mysql
RUN docker-php-ext-install pdo pdo_mysql

# Copy your PHP project into the container
COPY ./test /var/www/html

RUN a2enmod rewrite

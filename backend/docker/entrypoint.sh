#!/bin/sh
set -e

# Dynamically set Nginx port to Render's PORT env var (defaults to 10000)
PORT=${PORT:-10000}
sed -i "s/listen 10000;/listen ${PORT};/g" /etc/nginx/nginx.conf

echo "Optimizing Laravel for production..."
php artisan config:cache
php artisan route:cache
php artisan view:cache

if [ "$RUN_MIGRATIONS" = "true" ]; then
    echo "Running database migrations..."
    php artisan migrate --force
fi

echo "Starting services (Nginx + PHP-FPM)..."
exec /usr/bin/supervisord -c /etc/supervisord.conf

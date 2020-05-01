FROM php:7.3.10-fpm-alpine3.10
RUN apk add --no-cache openssl \
  bash \
  mysql-client \
  nodejs \
  npm \
  freetype-dev \
  libjpeg-turbo-dev \
  libpng-dev

RUN touch /root/.bashrc | echo "PS1='\w\$ '" >> /root/.bashrc

RUN docker-php-ext-install pdo pdo_mysql bcmath
RUN docker-php-ext-configure gd --with-gd --with-freetype-dir=/usr/include/ --with-jpeg-dir=/usr/include/ --with-png-dir=/usr/include/
RUN docker-php-ext-install -j$(nproc) gd

# Yarn setup
ADD https://yarnpkg.com/latest.tar.gz /opt/yarn.tar.gz
RUN cd /opt \
  && mkdir yarn \
  && tar xzf yarn.tar.gz -C yarn --strip-components 1 \
  && cd /usr/local/bin \
  && ln -s /opt/yarn/bin/yarn

ENV DOCKERIZE_VERSION v0.6.1
RUN wget https://github.com/jwilder/dockerize/releases/download/$DOCKERIZE_VERSION/dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && tar -C /usr/local/bin -xzvf dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz \
  && rm dockerize-alpine-linux-amd64-$DOCKERIZE_VERSION.tar.gz

WORKDIR /var/www
RUN rm -rf /var/www/html

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# COPY . /var/www
RUN ln -s public html

EXPOSE 9000
ENTRYPOINT [ "php-fpm" ]

FROM postgres:16

COPY init.sql /docker-entrypoint-initdb.d/

ENV POSTGRES_DB device-management
ENV POSTGRES_USER postgres
ENV POSTGRES_PASSWORD postgres
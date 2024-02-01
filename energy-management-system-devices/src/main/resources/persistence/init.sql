CREATE TABLE device
(
    id bigint NOT NULL,
    address character varying(255) COLLATE pg_catalog."default",
    description character varying(255) COLLATE pg_catalog."default",
    maximum_hourly_consumption numeric(38,2),
    uid uuid,
    user_uid uuid,
    CONSTRAINT device_pkey PRIMARY KEY (id)
);
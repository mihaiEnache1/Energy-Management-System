CREATE TABLE users
(
    id bigint NOT NULL,
    email character varying(255) COLLATE pg_catalog."default",
    name character varying(255) COLLATE pg_catalog."default",
    password character varying(255) COLLATE pg_catalog."default",
    role character varying(255) COLLATE pg_catalog."default",
    uid uuid,
    CONSTRAINT users_pkey PRIMARY KEY (id),
    CONSTRAINT users_role_check CHECK (role::text = ANY (ARRAY['CLIENT'::character varying, 'ADMIN'::character varying]::text[]))
);
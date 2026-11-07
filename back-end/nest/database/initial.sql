/* PRODUCTS */
CREATE TABLE products (
    product_id integer NOT NULL,
    name character varying NOT NULL,
    description character varying NOT NULL,
    is_active boolean NOT NULL,
    is_promo boolean NOT NULL,
    created_date date NOT NULL,
    modified_date date NOT NULL
);


ALTER TABLE products OWNER TO postgres;

ALTER TABLE ONLY products
    ADD CONSTRAINT products_pkey PRIMARY KEY (product_id);

CREATE SEQUENCE products_product_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE products_product_id_seq OWNER TO postgres;

ALTER SEQUENCE products_product_id_seq OWNED BY products.product_id;

ALTER TABLE ONLY products ALTER COLUMN product_id SET DEFAULT nextval('products_product_id_seq'::regclass);

/* IMAGES FOR PRODUCTS */

CREATE TABLE products_images (
    product_image_id integer NOT NULL,
    product_id integer NOT NULL,
    file character varying NOT NULL
);


ALTER TABLE products_images OWNER TO postgres;

ALTER TABLE ONLY products_images
    ADD CONSTRAINT products_images_pkey PRIMARY KEY (product_image_id);

CREATE SEQUENCE products_images_product_image_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE products_images_product_image_id_seq OWNER TO postgres;

ALTER SEQUENCE products_images_product_image_id_seq OWNED BY products_images.product_image_id;

ALTER TABLE ONLY products_images ALTER COLUMN product_image_id SET DEFAULT nextval('products_images_product_image_id_seq'::regclass);


/* RATES FOR PRODUCTS */
CREATE TABLE products_rates (
    product_rate_id integer NOT NULL,
    product_id integer NOT NULL,
    user_id integer NOT NULL,
    value smallint NOT NULL
);


ALTER TABLE products_rates OWNER TO postgres;


CREATE SEQUENCE products_rates_product_rate_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE products_rates_product_rate_id_seq OWNER TO postgres;

ALTER SEQUENCE products_rates_product_rate_id_seq OWNED BY products_rates.product_rate_id;

ALTER TABLE ONLY products_rates ALTER COLUMN product_rate_id SET DEFAULT nextval('products_rates_product_rate_id_seq'::regclass);

ALTER TABLE products_rates
  ADD CONSTRAINT combination UNIQUE(product_id, user_id);

/* ROLES OF USERS */
CREATE TABLE roles (
    role_id integer NOT NULL,
    name character varying(16)
);


ALTER TABLE roles OWNER TO postgres;

ALTER TABLE ONLY roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (role_id);

CREATE SEQUENCE roles_role_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE roles_role_id_seq OWNER TO postgres;

ALTER SEQUENCE roles_role_id_seq OWNED BY roles.role_id;

ALTER TABLE ONLY roles ALTER COLUMN role_id SET DEFAULT nextval('roles_role_id_seq'::regclass);


INSERT INTO roles (role_id, name) VALUES (1, 'standard');
INSERT INTO roles (role_id, name) VALUES (2, 'admin');


/* USERS */
CREATE TABLE users (
    user_id integer NOT NULL,
    username character varying,
    avatar character varying,
    email character varying,
    password character varying NOT NULL,
    role_id smallint NOT NULL,
    created_date date NOT NULL,
    modified_date date NOT NULL
);


ALTER TABLE users OWNER TO postgres;


ALTER TABLE ONLY users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


ALTER TABLE ONLY users
    ADD CONSTRAINT email UNIQUE (email);


ALTER TABLE ONLY users
    ADD CONSTRAINT username UNIQUE (username);    


CREATE SEQUENCE users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE users_user_id_seq OWNER TO postgres;


ALTER SEQUENCE users_user_id_seq OWNED BY users.user_id;


ALTER TABLE ONLY users ALTER COLUMN user_id SET DEFAULT nextval('users_user_id_seq'::regclass);


INSERT INTO users (username, avatar, email, password, role_id, created_date, modified_date) VALUES ('admin', NULL, 'admin@only-buy.com', '$2y$10$CCz2LXxnAhJB0yEfMGdxluqyuC20.G98DMLn9whWtyLUnlnT9s9aO', 2, '2023-06-05', '2023-06-05');
INSERT INTO users (username, avatar, email, password, role_id, created_date, modified_date) VALUES ('only-buy', NULL, 'only-buy@only-buy.com', '$2y$10$CCz2LXxnAhJB0yEfMGdxluqyuC20.G98DMLn9whWtyLUnlnT9s9aO', 1, '2023-06-05', '2023-06-05');

/* FOREIGN KEYS - USERS */
ALTER TABLE users
    ADD FOREIGN KEY (role_id) REFERENCES roles(role_id);

/* FOREIGN KEYS - RATES OF PRODUCTS */
ALTER TABLE products_rates
    ADD FOREIGN KEY (product_id) REFERENCES products(product_id);

ALTER TABLE products_rates
    ADD FOREIGN KEY (user_id) REFERENCES users(user_id);

/* FOREIGN KEYS - IMAGES OF PRODUCTS */
ALTER TABLE products_images
    ADD FOREIGN KEY (product_id) REFERENCES products(product_id);
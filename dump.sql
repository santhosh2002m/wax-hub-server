--
-- PostgreSQL database dump
--

-- Dumped from database version 16.9
-- Dumped by pg_dump version 16.9

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: santhoshh
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO santhoshh;

--
-- Name: enum_Messages_status; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public."enum_Messages_status" AS ENUM (
    'pending',
    'sent',
    'failed'
);


ALTER TYPE public."enum_Messages_status" OWNER TO santhoshh;

--
-- Name: enum_Tickets_category; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public."enum_Tickets_category" AS ENUM (
    'Adult',
    'Child',
    'Senior',
    'Group',
    'Other'
);


ALTER TYPE public."enum_Tickets_category" OWNER TO santhoshh;

--
-- Name: enum_Transactions_category; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public."enum_Transactions_category" AS ENUM (
    'Adult',
    'Child',
    'Senior',
    'Group',
    'Other'
);


ALTER TYPE public."enum_Transactions_category" OWNER TO santhoshh;

--
-- Name: enum_counters_dashboard_access; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public.enum_counters_dashboard_access AS ENUM (
    'admin',
    'user',
    'special'
);


ALTER TYPE public.enum_counters_dashboard_access OWNER TO santhoshh;

--
-- Name: enum_counters_role; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public.enum_counters_role AS ENUM (
    'admin',
    'manager',
    'user',
    'special'
);


ALTER TYPE public.enum_counters_role OWNER TO santhoshh;

--
-- Name: enum_guides_status; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public.enum_guides_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.enum_guides_status OWNER TO santhoshh;

--
-- Name: enum_special_tickets_category; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public.enum_special_tickets_category AS ENUM (
    'Adult',
    'Child',
    'Senior',
    'Group',
    'Other'
);


ALTER TYPE public.enum_special_tickets_category OWNER TO santhoshh;

--
-- Name: enum_special_tickets_status; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public.enum_special_tickets_status AS ENUM (
    'pending',
    'completed',
    'cancelled'
);


ALTER TYPE public.enum_special_tickets_status OWNER TO santhoshh;

--
-- Name: enum_tickets_created_by; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public.enum_tickets_created_by AS ENUM (
    'admin',
    'user'
);


ALTER TYPE public.enum_tickets_created_by OWNER TO santhoshh;

--
-- Name: enum_twilio_messages_direction; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public.enum_twilio_messages_direction AS ENUM (
    'outbound-api',
    'inbound'
);


ALTER TYPE public.enum_twilio_messages_direction OWNER TO santhoshh;

--
-- Name: enum_user_guides_status; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public.enum_user_guides_status AS ENUM (
    'active',
    'inactive'
);


ALTER TYPE public.enum_user_guides_status OWNER TO santhoshh;

--
-- Name: enum_user_tickets_status; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public.enum_user_tickets_status AS ENUM (
    'completed',
    'pending',
    'cancelled'
);


ALTER TYPE public.enum_user_tickets_status OWNER TO santhoshh;

--
-- Name: enum_users_role; Type: TYPE; Schema: public; Owner: santhoshh
--

CREATE TYPE public.enum_users_role AS ENUM (
    'ticket_manager',
    'admin'
);


ALTER TYPE public.enum_users_role OWNER TO santhoshh;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Guides; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public."Guides" (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    number character varying(20),
    vehicle_type character varying(50),
    score integer DEFAULT 0,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public."Guides" OWNER TO santhoshh;

--
-- Name: Guides_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public."Guides_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Guides_id_seq" OWNER TO santhoshh;

--
-- Name: Guides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public."Guides_id_seq" OWNED BY public."Guides".id;


--
-- Name: Tickets; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public."Tickets" (
    id integer NOT NULL,
    price integer NOT NULL,
    ticket_type character varying(100),
    show_name character varying(100),
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    category public."enum_Tickets_category" DEFAULT 'Other'::public."enum_Tickets_category" NOT NULL
);


ALTER TABLE public."Tickets" OWNER TO santhoshh;

--
-- Name: Tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public."Tickets_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Tickets_id_seq" OWNER TO santhoshh;

--
-- Name: Tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public."Tickets_id_seq" OWNED BY public."Tickets".id;


--
-- Name: Transactions; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public."Transactions" (
    id integer NOT NULL,
    invoice_no character varying(50),
    date timestamp with time zone NOT NULL,
    adult_count integer DEFAULT 1,
    total_paid integer NOT NULL,
    ticket_id integer,
    counter_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    child_count integer DEFAULT 0 NOT NULL,
    category public."enum_Transactions_category" DEFAULT 'Other'::public."enum_Transactions_category" NOT NULL
);


ALTER TABLE public."Transactions" OWNER TO santhoshh;

--
-- Name: Transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public."Transactions_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Transactions_id_seq" OWNER TO santhoshh;

--
-- Name: Transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public."Transactions_id_seq" OWNED BY public."Transactions".id;


--
-- Name: counters; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public.counters (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_counters_role DEFAULT 'manager'::public.enum_counters_role NOT NULL,
    special boolean DEFAULT false NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.counters OWNER TO santhoshh;

--
-- Name: counters_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public.counters_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.counters_id_seq OWNER TO santhoshh;

--
-- Name: counters_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public.counters_id_seq OWNED BY public.counters.id;


--
-- Name: guides; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public.guides (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    number character varying(20) NOT NULL,
    vehicle_type character varying(50) NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    total_bookings integer DEFAULT 0 NOT NULL,
    rating numeric(3,1) DEFAULT 0 NOT NULL,
    status public.enum_guides_status DEFAULT 'active'::public.enum_guides_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.guides OWNER TO santhoshh;

--
-- Name: guides_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public.guides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.guides_id_seq OWNER TO santhoshh;

--
-- Name: guides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public.guides_id_seq OWNED BY public.guides.id;


--
-- Name: messages; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public.messages (
    id integer NOT NULL,
    message text NOT NULL,
    counter_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.messages OWNER TO santhoshh;

--
-- Name: messages_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public.messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.messages_id_seq OWNER TO santhoshh;

--
-- Name: messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public.messages_id_seq OWNED BY public.messages.id;


--
-- Name: special_guides; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public.special_guides (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    number character varying(20),
    vehicle_type character varying(50),
    score integer DEFAULT 0,
    counter_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.special_guides OWNER TO santhoshh;

--
-- Name: special_guides_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public.special_guides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.special_guides_id_seq OWNER TO santhoshh;

--
-- Name: special_guides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public.special_guides_id_seq OWNED BY public.special_guides.id;


--
-- Name: special_tickets; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public.special_tickets (
    id integer NOT NULL,
    invoice_no character varying(255) NOT NULL,
    vehicle_type character varying(255) NOT NULL,
    guide_name character varying(255) NOT NULL,
    guide_number character varying(255) NOT NULL,
    show_name character varying(255) NOT NULL,
    adults integer NOT NULL,
    ticket_price double precision NOT NULL,
    total_price double precision NOT NULL,
    tax double precision NOT NULL,
    final_amount double precision NOT NULL,
    status public.enum_special_tickets_status DEFAULT 'pending'::public.enum_special_tickets_status NOT NULL,
    counter_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.special_tickets OWNER TO santhoshh;

--
-- Name: special_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public.special_tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.special_tickets_id_seq OWNER TO santhoshh;

--
-- Name: special_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public.special_tickets_id_seq OWNED BY public.special_tickets.id;


--
-- Name: tickets; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public.tickets (
    id integer NOT NULL,
    price double precision NOT NULL,
    dropdown_name character varying(255) NOT NULL,
    show_name character varying(255) NOT NULL,
    counter_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    is_analytics boolean DEFAULT false NOT NULL
);


ALTER TABLE public.tickets OWNER TO santhoshh;

--
-- Name: tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public.tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.tickets_id_seq OWNER TO santhoshh;

--
-- Name: tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public.tickets_id_seq OWNED BY public.tickets.id;


--
-- Name: transactions; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public.transactions (
    id integer NOT NULL,
    invoice_no character varying(255) NOT NULL,
    date timestamp with time zone NOT NULL,
    adult_count integer NOT NULL,
    child_count integer NOT NULL,
    category character varying(255) NOT NULL,
    total_paid double precision NOT NULL,
    ticket_id integer NOT NULL,
    counter_id integer,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.transactions OWNER TO santhoshh;

--
-- Name: transactions_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public.transactions_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.transactions_id_seq OWNER TO santhoshh;

--
-- Name: transactions_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public.transactions_id_seq OWNED BY public.transactions.id;


--
-- Name: twilio_messages; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public.twilio_messages (
    id integer NOT NULL,
    message_sid character varying(255) NOT NULL,
    "to" character varying(255) NOT NULL,
    "from" character varying(255) NOT NULL,
    body text NOT NULL,
    status character varying(255) NOT NULL,
    direction public.enum_twilio_messages_direction NOT NULL,
    price character varying(255),
    price_unit character varying(255),
    error_code character varying(255),
    error_message text,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.twilio_messages OWNER TO santhoshh;

--
-- Name: twilio_messages_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public.twilio_messages_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.twilio_messages_id_seq OWNER TO santhoshh;

--
-- Name: twilio_messages_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public.twilio_messages_id_seq OWNED BY public.twilio_messages.id;


--
-- Name: user_guides; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public.user_guides (
    id integer NOT NULL,
    name character varying(255) NOT NULL,
    number character varying(255) DEFAULT 'N/A'::character varying NOT NULL,
    vehicle_type character varying(255) DEFAULT 'Unknown'::character varying NOT NULL,
    score integer DEFAULT 0 NOT NULL,
    total_bookings integer DEFAULT 0 NOT NULL,
    rating double precision DEFAULT '0'::double precision NOT NULL,
    status character varying(255) DEFAULT 'active'::character varying NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL
);


ALTER TABLE public.user_guides OWNER TO santhoshh;

--
-- Name: user_guides_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public.user_guides_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_guides_id_seq OWNER TO santhoshh;

--
-- Name: user_guides_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public.user_guides_id_seq OWNED BY public.user_guides.id;


--
-- Name: user_tickets; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public.user_tickets (
    id integer NOT NULL,
    invoice_no character varying(255) NOT NULL,
    vehicle_type character varying(255) NOT NULL,
    guide_name character varying(255) NOT NULL,
    guide_number character varying(255) NOT NULL,
    show_name character varying(255) NOT NULL,
    adults integer NOT NULL,
    ticket_price double precision NOT NULL,
    total_price double precision NOT NULL,
    tax double precision NOT NULL,
    final_amount double precision NOT NULL,
    status public.enum_user_tickets_status DEFAULT 'pending'::public.enum_user_tickets_status NOT NULL,
    user_id integer NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL,
    counter_id integer
);


ALTER TABLE public.user_tickets OWNER TO santhoshh;

--
-- Name: user_tickets_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public.user_tickets_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.user_tickets_id_seq OWNER TO santhoshh;

--
-- Name: user_tickets_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public.user_tickets_id_seq OWNED BY public.user_tickets.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: santhoshh
--

CREATE TABLE public.users (
    id integer NOT NULL,
    username character varying(50) NOT NULL,
    password character varying(255) NOT NULL,
    role public.enum_users_role DEFAULT 'ticket_manager'::public.enum_users_role NOT NULL,
    "createdAt" timestamp with time zone NOT NULL,
    "updatedAt" timestamp with time zone NOT NULL
);


ALTER TABLE public.users OWNER TO santhoshh;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: santhoshh
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO santhoshh;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: santhoshh
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: Guides id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public."Guides" ALTER COLUMN id SET DEFAULT nextval('public."Guides_id_seq"'::regclass);


--
-- Name: Tickets id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public."Tickets" ALTER COLUMN id SET DEFAULT nextval('public."Tickets_id_seq"'::regclass);


--
-- Name: Transactions id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public."Transactions" ALTER COLUMN id SET DEFAULT nextval('public."Transactions_id_seq"'::regclass);


--
-- Name: counters id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters ALTER COLUMN id SET DEFAULT nextval('public.counters_id_seq'::regclass);


--
-- Name: guides id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.guides ALTER COLUMN id SET DEFAULT nextval('public.guides_id_seq'::regclass);


--
-- Name: messages id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.messages ALTER COLUMN id SET DEFAULT nextval('public.messages_id_seq'::regclass);


--
-- Name: special_guides id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_guides ALTER COLUMN id SET DEFAULT nextval('public.special_guides_id_seq'::regclass);


--
-- Name: special_tickets id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets ALTER COLUMN id SET DEFAULT nextval('public.special_tickets_id_seq'::regclass);


--
-- Name: tickets id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.tickets ALTER COLUMN id SET DEFAULT nextval('public.tickets_id_seq'::regclass);


--
-- Name: transactions id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions ALTER COLUMN id SET DEFAULT nextval('public.transactions_id_seq'::regclass);


--
-- Name: twilio_messages id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages ALTER COLUMN id SET DEFAULT nextval('public.twilio_messages_id_seq'::regclass);


--
-- Name: user_guides id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_guides ALTER COLUMN id SET DEFAULT nextval('public.user_guides_id_seq'::regclass);


--
-- Name: user_tickets id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets ALTER COLUMN id SET DEFAULT nextval('public.user_tickets_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Data for Name: Guides; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public."Guides" (id, name, number, vehicle_type, score, "createdAt", "updatedAt") FROM stdin;
1	Rajesh Kumar	9876543210	car	95	2025-08-31 22:48:16.193-04	2025-08-31 22:48:16.193-04
2	Suresh Patel	8765432109	tt	88	2025-08-31 22:48:16.193-04	2025-08-31 22:48:16.193-04
3	Mohan Singh	7654321098	big car	92	2025-08-31 22:48:16.193-04	2025-08-31 22:48:16.193-04
\.


--
-- Data for Name: Tickets; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public."Tickets" (id, price, ticket_type, show_name, "createdAt", "updatedAt", category) FROM stdin;
1	500	Adult Entry	Cultural Show	2025-08-31 22:48:16.186-04	2025-08-31 22:48:16.186-04	Other
2	300	Child Entry	Cultural Show	2025-08-31 22:48:16.186-04	2025-08-31 22:48:16.186-04	Other
3	400	Senior Entry	Cultural Show	2025-08-31 22:48:16.186-04	2025-08-31 22:48:16.186-04	Other
4	1200	Group Package	Cultural Show	2025-08-31 22:48:16.186-04	2025-08-31 22:48:16.186-04	Other
\.


--
-- Data for Name: Transactions; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public."Transactions" (id, invoice_no, date, adult_count, total_paid, ticket_id, counter_id, "createdAt", "updatedAt", child_count, category) FROM stdin;
\.


--
-- Data for Name: counters; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public.counters (id, username, password, role, special, "createdAt", "updatedAt") FROM stdin;
1	admin	$2a$10$jijKcG.fay4a/gywNRlpk.PDqRephOZbhkskF2phhLemq5X0yDNba	admin	f	2025-09-01 02:25:53.198-04	2025-09-01 02:25:53.198-04
2	manager1	$2a$10$jijKcG.fay4a/gywNRlpk.PDqRephOZbhkskF2phhLemq5X0yDNba	manager	f	2025-09-01 02:25:53.198-04	2025-09-01 02:25:53.198-04
3	user1	$2a$10$jijKcG.fay4a/gywNRlpk.PDqRephOZbhkskF2phhLemq5X0yDNba	user	f	2025-09-01 02:25:53.198-04	2025-09-01 02:25:53.198-04
4	special_counter	$2a$10$jijKcG.fay4a/gywNRlpk.PDqRephOZbhkskF2phhLemq5X0yDNba	user	t	2025-09-01 02:25:53.198-04	2025-09-01 02:25:53.198-04
5	new_manager	$2a$10$aTJT6PoAuUXUuj2.D5hxlu10kmS8i8hlE8E98aXCeHKB16ocxFSyG	user	f	2025-09-01 02:26:29.941-04	2025-09-01 02:26:29.941-04
6	admin1	$2a$10$drQbbBfRmbXrtxVExSuPw.2DlJ3BpFlhShPeoTiqGwYT4XVtlPZLG	user	t	2025-09-01 04:18:52.662-04	2025-09-01 04:18:52.662-04
7	admins	$2a$10$RnsEuu314EslBTxJG2OYTeDKpOeFOQN6a7BRotAU9RDdi95.4apHe	user	t	2025-09-01 04:22:31.433-04	2025-09-01 04:22:31.433-04
8	santhoshm	$2a$10$.yaJEb7edWO8k/RpQLk/KeOiVeXQJPvNA5dHNqZWeGJRKfyg08SJu	manager	t	2025-09-01 04:32:27.993-04	2025-09-01 04:32:27.993-04
9	123456	$2a$10$UQG5FOG3H7Tpln1MnZRwTekLJnjl4RxVjxRLXQD4q726Y5KPOLrkK	manager	t	2025-09-01 04:33:00.902-04	2025-09-01 04:33:00.902-04
10	admin123	$2a$10$aGo.3NuxrC8CdsDtRIqsSOhTplv5h.cHkp38g2UFot7VUeqjFIkhe	user	t	2025-09-01 04:33:37.964-04	2025-09-01 04:33:37.964-04
11	root	$2a$10$E6u1KhTP7t2yWD4YVwRf7.5As5Y6rJWLqOE4StRieka3DwkAXz.cW	user	t	2025-09-01 05:11:35.311-04	2025-09-01 05:11:35.311-04
12	root1	$2a$10$vOlpmOUWzSDDHSxT5sbQwOwyBpz0/w0ytC9IRRHHHtzMCDoxkEIEi	user	f	2025-09-01 05:42:17.92-04	2025-09-01 05:42:17.92-04
13	hell	$2a$10$TXO8j7CbHlxGyK9xeUEiDeLtw3.76P3D/C.g0eH.qZNlFlvACDKea	user	f	2025-09-01 06:09:55.002-04	2025-09-01 06:09:55.002-04
14	adminss	$2a$10$AJl/3.XLgInuLofmlZFCruLDc28HSyxesFA6dUn6HzfVeJMXRmh1K	user	f	2025-09-01 06:23:17.63-04	2025-09-01 06:23:17.63-04
15	112233	$2a$10$7x1BDgtzkloYlUOMTab.lOohON5tPNpsQCtc2esr77lV02hjTpwPm	user	t	2025-09-01 06:44:17.875-04	2025-09-01 06:44:17.875-04
16	hell09	$2a$10$uKgK/nvx41RtUbyuXfepHudmx.y5ldUlPWzGA26trFTdJ5G3vW0tO	user	f	2025-09-01 09:46:07.117-04	2025-09-01 09:46:07.117-04
17	tic	$2a$10$o.YD5oc69Lm8aOO5/aK1VeZHwfUfUAlR8ZnHrk1Q6Mngk30EstQQu	user	f	2025-09-01 09:47:32.658-04	2025-09-01 09:47:32.658-04
18	man	$2a$10$3SKUnw2n7fgUifwTqwcwl.HqNN6CgNDqcqwnHck8In1Ke.y9E0JAy	manager	f	2025-09-01 12:23:59.716-04	2025-09-01 12:23:59.716-04
19	rot	$2a$10$MRQUngpljKN/ez8KOr06..8DgkDnyICeadsZSvCQSJ1YpSrVcATgO	manager	t	2025-09-01 12:26:55.84-04	2025-09-01 12:26:55.84-04
\.


--
-- Data for Name: guides; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public.guides (id, name, number, vehicle_type, score, total_bookings, rating, status, created_at, updated_at) FROM stdin;
\.


--
-- Data for Name: messages; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public.messages (id, message, counter_id, "createdAt", "updatedAt") FROM stdin;
1	Please ensure all tickets are properly logged	3	2025-08-28 02:25:54.023-04	2025-08-28 02:25:54.023-04
2	Special discount for group bookings this weekend	3	2025-08-31 02:25:54.023-04	2025-08-31 02:25:54.023-04
3	New show schedule starting next week	1	2025-08-23 02:25:54.023-04	2025-08-23 02:25:54.023-04
4	Special discount for group bookings this weekend	1	2025-08-31 02:25:54.023-04	2025-08-31 02:25:54.023-04
5	New show schedule starting next week	1	2025-08-29 02:25:54.023-04	2025-08-29 02:25:54.023-04
6	Reminder: Daily report due by 6 PM	1	2025-08-30 02:25:54.023-04	2025-08-30 02:25:54.023-04
7	Please ensure all tickets are properly logged	2	2025-08-23 02:25:54.023-04	2025-08-23 02:25:54.023-04
8	Reminder: Daily report due by 6 PM	2	2025-08-27 02:25:54.023-04	2025-08-27 02:25:54.023-04
9	Please ensure all tickets are properly logged	1	2025-09-01 02:25:54.023-04	2025-09-01 02:25:54.023-04
10	Please ensure all tickets are properly logged	2	2025-08-26 02:25:54.023-04	2025-08-26 02:25:54.023-04
11	Please ensure all tickets are properly logged	1	2025-08-27 02:25:54.023-04	2025-08-27 02:25:54.023-04
12	Please ensure all tickets are properly logged	3	2025-09-01 02:25:54.023-04	2025-09-01 02:25:54.023-04
13	Please ensure all tickets are properly logged	4	2025-09-01 02:25:54.023-04	2025-09-01 02:25:54.023-04
14	System maintenance scheduled for tomorrow night	3	2025-08-28 02:25:54.023-04	2025-08-28 02:25:54.023-04
15	New show schedule starting next week	1	2025-08-26 02:25:54.023-04	2025-08-26 02:25:54.023-04
\.


--
-- Data for Name: special_guides; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public.special_guides (id, name, number, vehicle_type, score, counter_id, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: special_tickets; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public.special_tickets (id, invoice_no, vehicle_type, guide_name, guide_number, show_name, adults, ticket_price, total_price, tax, final_amount, status, counter_id, "createdAt", "updatedAt") FROM stdin;
2	SPT1001	Luxury Van	Special Guide 2	+919876554001	VIP Show	2	500	1000	180	1180	completed	4	2025-09-01 02:25:53.898-04	2025-09-01 02:25:53.898-04
16	SPT50A8702C	big car	santhosh	9361886282	priya	2	111	222	0	222	completed	15	2025-09-01 09:42:22.955-04	2025-09-01 09:42:22.955-04
17	SPT76AE115B	big car	santhosh	9361886282	priya	3	12	36	0	36	completed	15	2025-09-01 09:44:35.127-04	2025-09-01 09:44:35.127-04
18	SPTA4BD850D	Luxury Bus	VIP Guide	+919000000000	VIP Experience	6	500	3000	540	3540	completed	15	2025-09-01 09:50:58.95-04	2025-09-01 09:50:58.95-04
19	SPTC83847E9	Luxury Bus	VIP Guide	+919000000000	VIP Experience	6	500	3000	540	3540	completed	15	2025-09-01 09:51:13.638-04	2025-09-01 09:51:13.638-04
20	SPTB54AC6EB	big car	santhosh	9361886282	priya	2	111	222	0	222	completed	15	2025-09-01 11:00:00.352-04	2025-09-01 11:00:00.352-04
21	SPT9B29C346	big car	santhosh		priya	4	111	444	0	444	completed	6	2025-09-01 11:08:27.463-04	2025-09-01 11:08:27.463-04
22	SPT85073163	tt	santhosh	9361886282	big car	3	444	1332	0	1332	completed	6	2025-09-01 11:24:50.198-04	2025-09-01 11:24:50.198-04
23	SPT70838492	big car	santhosh	9361886282	big car	3	444	1332	0	1332	completed	15	2025-09-01 11:32:41.656-04	2025-09-01 11:32:41.656-04
24	SPTBACC0347	tt	santhosh	9361886282	big car	3	1332	3996	0	3996	completed	6	2025-09-01 11:33:16.583-04	2025-09-01 11:33:16.583-04
25	SPT40EA75B0	Luxury Bus	VIP Guide	+919000000000	VIP Experience	6	500	3000	540	3540	completed	15	2025-09-01 11:52:54.122-04	2025-09-01 11:52:54.122-04
26	SPTF4116344	Luxury Bus	VIP Guide	+919000000000	VIP Experience	6	500	3000	540	3540	completed	15	2025-09-01 11:53:10.82-04	2025-09-01 11:53:10.82-04
27	SPT6A4A04FA	Luxury Bus	VIP Guide	+919000000000	VIP Experience	6	500	3000	540	3540	completed	15	2025-09-01 11:57:36.68-04	2025-09-01 11:57:36.68-04
28	SPT39F644A8	big car	santhosh	9361886282	priya	2	1111	2222	0	2222	completed	6	2025-09-01 12:22:23.858-04	2025-09-01 12:22:23.858-04
29	SPT4F087FBA	tt	santhosh	9361886282	priya	4	1111	4444	0	4444	completed	15	2025-09-01 12:23:04.282-04	2025-09-01 12:23:04.282-04
\.


--
-- Data for Name: tickets; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public.tickets (id, price, dropdown_name, show_name, counter_id, "createdAt", "updatedAt", is_analytics) FROM stdin;
142	333	big car	priya	16	2025-09-01 10:07:08.44-04	2025-09-01 10:07:08.44-04	t
143	444	big car	priya	16	2025-09-01 10:15:42.275-04	2025-09-01 10:15:42.275-04	t
151	1111	priya	Horror Movie	1	2025-09-01 12:22:09.471-04	2025-09-01 12:22:09.471-04	f
\.


--
-- Data for Name: transactions; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public.transactions (id, invoice_no, date, adult_count, child_count, category, total_paid, ticket_id, counter_id, "createdAt", "updatedAt") FROM stdin;
138	TKT4CF982CE	2025-09-01 10:15:42.291-04	4	0	Group	444	143	16	2025-09-01 10:15:42.292-04	2025-09-01 10:15:42.292-04
137	TKTEDE1919F	2025-09-01 10:07:08.456-04	3	0	Group	333	142	16	2025-09-01 10:07:08.456-04	2025-09-01 10:07:08.456-04
\.


--
-- Data for Name: twilio_messages; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public.twilio_messages (id, message_sid, "to", "from", body, status, direction, price, price_unit, error_code, error_message, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Data for Name: user_guides; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public.user_guides (id, name, number, vehicle_type, score, total_bookings, rating, status, created_at, updated_at) FROM stdin;
9	1010101	N/A	car	10	1	4	active	2025-09-01 05:50:43.688-04	2025-09-01 05:50:43.688-04
10	10101012	9361886282	big car	10	1	4	active	2025-09-01 05:52:29.282-04	2025-09-01 05:52:29.282-04
7	Helo	+0000000000	Cdddddassssssr	60	6	4	active	2025-09-01 04:09:56.61-04	2025-09-01 09:50:38.163-04
8	santhosh	9361886282	big car	300	30	4.5	active	2025-09-01 04:16:23.316-04	2025-09-01 10:15:42.304-04
\.


--
-- Data for Name: user_tickets; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public.user_tickets (id, invoice_no, vehicle_type, guide_name, guide_number, show_name, adults, ticket_price, total_price, tax, final_amount, status, user_id, "createdAt", "updatedAt", counter_id) FROM stdin;
4	TKT1003	Van	Rajesh Kumar	+919876543003	Water Show	9	200	1800	324	2124	completed	4	2025-09-01 02:25:53.76-04	2025-09-01 02:25:53.76-04	4
10	TKT1009	Bus	Anil Sharma	+919876543009	Water Show	8	200	1600	288	1888	completed	4	2025-09-01 02:25:53.76-04	2025-09-01 02:25:53.76-04	4
48	TKTEDE1919F	big car	santhosh	9361886282	priya	3	111	333	0	333	completed	16	2025-09-01 10:07:08.439-04	2025-09-01 10:07:08.439-04	16
49	TKT4CF982CE	big car	santhosh	9361886282	priya	4	111	444	0	444	completed	16	2025-09-01 10:15:42.274-04	2025-09-01 10:15:42.274-04	16
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: santhoshh
--

COPY public.users (id, username, password, role, "createdAt", "updatedAt") FROM stdin;
\.


--
-- Name: Guides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public."Guides_id_seq"', 3, true);


--
-- Name: Tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public."Tickets_id_seq"', 4, true);


--
-- Name: Transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public."Transactions_id_seq"', 1, false);


--
-- Name: counters_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public.counters_id_seq', 19, true);


--
-- Name: guides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public.guides_id_seq', 1, false);


--
-- Name: messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public.messages_id_seq', 15, true);


--
-- Name: special_guides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public.special_guides_id_seq', 1, false);


--
-- Name: special_tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public.special_tickets_id_seq', 29, true);


--
-- Name: tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public.tickets_id_seq', 151, true);


--
-- Name: transactions_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public.transactions_id_seq', 145, true);


--
-- Name: twilio_messages_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public.twilio_messages_id_seq', 1, false);


--
-- Name: user_guides_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public.user_guides_id_seq', 10, true);


--
-- Name: user_tickets_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public.user_tickets_id_seq', 49, true);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: santhoshh
--

SELECT pg_catalog.setval('public.users_id_seq', 1, false);


--
-- Name: Guides Guides_number_key; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public."Guides"
    ADD CONSTRAINT "Guides_number_key" UNIQUE (number);


--
-- Name: Guides Guides_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public."Guides"
    ADD CONSTRAINT "Guides_pkey" PRIMARY KEY (id);


--
-- Name: Tickets Tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public."Tickets"
    ADD CONSTRAINT "Tickets_pkey" PRIMARY KEY (id);


--
-- Name: Transactions Transactions_invoice_no_key; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_invoice_no_key" UNIQUE (invoice_no);


--
-- Name: Transactions Transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_pkey" PRIMARY KEY (id);


--
-- Name: counters counters_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_pkey PRIMARY KEY (id);


--
-- Name: counters counters_username_key; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key UNIQUE (username);


--
-- Name: counters counters_username_key1; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key1 UNIQUE (username);


--
-- Name: counters counters_username_key10; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key10 UNIQUE (username);


--
-- Name: counters counters_username_key11; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key11 UNIQUE (username);


--
-- Name: counters counters_username_key12; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key12 UNIQUE (username);


--
-- Name: counters counters_username_key13; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key13 UNIQUE (username);


--
-- Name: counters counters_username_key14; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key14 UNIQUE (username);


--
-- Name: counters counters_username_key15; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key15 UNIQUE (username);


--
-- Name: counters counters_username_key16; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key16 UNIQUE (username);


--
-- Name: counters counters_username_key17; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key17 UNIQUE (username);


--
-- Name: counters counters_username_key18; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key18 UNIQUE (username);


--
-- Name: counters counters_username_key19; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key19 UNIQUE (username);


--
-- Name: counters counters_username_key2; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key2 UNIQUE (username);


--
-- Name: counters counters_username_key20; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key20 UNIQUE (username);


--
-- Name: counters counters_username_key21; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key21 UNIQUE (username);


--
-- Name: counters counters_username_key22; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key22 UNIQUE (username);


--
-- Name: counters counters_username_key23; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key23 UNIQUE (username);


--
-- Name: counters counters_username_key24; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key24 UNIQUE (username);


--
-- Name: counters counters_username_key25; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key25 UNIQUE (username);


--
-- Name: counters counters_username_key26; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key26 UNIQUE (username);


--
-- Name: counters counters_username_key27; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key27 UNIQUE (username);


--
-- Name: counters counters_username_key28; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key28 UNIQUE (username);


--
-- Name: counters counters_username_key29; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key29 UNIQUE (username);


--
-- Name: counters counters_username_key3; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key3 UNIQUE (username);


--
-- Name: counters counters_username_key30; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key30 UNIQUE (username);


--
-- Name: counters counters_username_key31; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key31 UNIQUE (username);


--
-- Name: counters counters_username_key32; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key32 UNIQUE (username);


--
-- Name: counters counters_username_key33; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key33 UNIQUE (username);


--
-- Name: counters counters_username_key34; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key34 UNIQUE (username);


--
-- Name: counters counters_username_key35; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key35 UNIQUE (username);


--
-- Name: counters counters_username_key36; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key36 UNIQUE (username);


--
-- Name: counters counters_username_key37; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key37 UNIQUE (username);


--
-- Name: counters counters_username_key38; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key38 UNIQUE (username);


--
-- Name: counters counters_username_key39; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key39 UNIQUE (username);


--
-- Name: counters counters_username_key4; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key4 UNIQUE (username);


--
-- Name: counters counters_username_key40; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key40 UNIQUE (username);


--
-- Name: counters counters_username_key41; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key41 UNIQUE (username);


--
-- Name: counters counters_username_key42; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key42 UNIQUE (username);


--
-- Name: counters counters_username_key43; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key43 UNIQUE (username);


--
-- Name: counters counters_username_key44; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key44 UNIQUE (username);


--
-- Name: counters counters_username_key45; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key45 UNIQUE (username);


--
-- Name: counters counters_username_key46; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key46 UNIQUE (username);


--
-- Name: counters counters_username_key47; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key47 UNIQUE (username);


--
-- Name: counters counters_username_key48; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key48 UNIQUE (username);


--
-- Name: counters counters_username_key5; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key5 UNIQUE (username);


--
-- Name: counters counters_username_key6; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key6 UNIQUE (username);


--
-- Name: counters counters_username_key7; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key7 UNIQUE (username);


--
-- Name: counters counters_username_key8; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key8 UNIQUE (username);


--
-- Name: counters counters_username_key9; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.counters
    ADD CONSTRAINT counters_username_key9 UNIQUE (username);


--
-- Name: guides guides_number_key; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.guides
    ADD CONSTRAINT guides_number_key UNIQUE (number);


--
-- Name: guides guides_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.guides
    ADD CONSTRAINT guides_pkey PRIMARY KEY (id);


--
-- Name: messages messages_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_pkey PRIMARY KEY (id);


--
-- Name: special_guides special_guides_number_key; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_guides
    ADD CONSTRAINT special_guides_number_key UNIQUE (number);


--
-- Name: special_guides special_guides_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_guides
    ADD CONSTRAINT special_guides_pkey PRIMARY KEY (id);


--
-- Name: special_tickets special_tickets_invoice_no_key; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key1; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key1 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key10; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key10 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key11; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key11 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key12; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key12 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key13; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key13 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key14; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key14 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key15; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key15 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key16; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key16 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key17; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key17 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key18; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key18 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key19; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key19 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key2; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key2 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key20; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key20 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key21; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key21 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key22; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key22 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key23; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key23 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key24; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key24 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key25; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key25 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key26; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key26 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key27; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key27 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key28; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key28 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key29; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key29 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key3; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key3 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key30; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key30 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key31; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key31 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key32; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key32 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key33; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key33 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key34; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key34 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key35; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key35 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key36; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key36 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key37; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key37 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key38; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key38 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key39; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key39 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key4; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key4 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key40; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key40 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key41; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key41 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key42; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key42 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key43; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key43 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key44; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key44 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key45; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key45 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key46; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key46 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key5; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key5 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key6; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key6 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key7; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key7 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key8; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key8 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_invoice_no_key9; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_invoice_no_key9 UNIQUE (invoice_no);


--
-- Name: special_tickets special_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_pkey PRIMARY KEY (id);


--
-- Name: tickets tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_pkey PRIMARY KEY (id);


--
-- Name: transactions transactions_invoice_no_key; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key1; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key1 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key10; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key10 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key11; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key11 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key12; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key12 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key13; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key13 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key14; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key14 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key15; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key15 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key16; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key16 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key17; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key17 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key18; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key18 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key19; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key19 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key2; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key2 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key20; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key20 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key21; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key21 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key22; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key22 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key23; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key23 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key24; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key24 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key25; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key25 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key26; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key26 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key27; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key27 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key28; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key28 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key29; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key29 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key3; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key3 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key30; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key30 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key31; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key31 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key32; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key32 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key33; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key33 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key34; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key34 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key35; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key35 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key36; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key36 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key37; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key37 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key38; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key38 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key39; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key39 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key4; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key4 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key40; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key40 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key41; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key41 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key42; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key42 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key43; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key43 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key44; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key44 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key45; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key45 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key46; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key46 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key47; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key47 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key48; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key48 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key5; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key5 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key6; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key6 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key7; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key7 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key8; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key8 UNIQUE (invoice_no);


--
-- Name: transactions transactions_invoice_no_key9; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_invoice_no_key9 UNIQUE (invoice_no);


--
-- Name: transactions transactions_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_pkey PRIMARY KEY (id);


--
-- Name: twilio_messages twilio_messages_message_sid_key; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key1; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key1 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key10; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key10 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key11; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key11 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key12; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key12 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key13; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key13 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key14; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key14 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key15; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key15 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key16; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key16 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key17; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key17 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key18; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key18 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key19; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key19 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key2; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key2 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key20; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key20 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key21; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key21 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key22; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key22 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key23; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key23 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key24; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key24 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key25; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key25 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key26; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key26 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key27; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key27 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key28; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key28 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key29; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key29 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key3; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key3 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key30; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key30 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key31; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key31 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key32; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key32 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key33; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key33 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key34; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key34 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key35; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key35 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key36; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key36 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key37; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key37 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key38; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key38 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key39; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key39 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key4; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key4 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key40; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key40 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key41; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key41 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key42; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key42 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key43; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key43 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key44; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key44 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key45; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key45 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key46; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key46 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key5; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key5 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key6; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key6 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key7; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key7 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key8; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key8 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_message_sid_key9; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_message_sid_key9 UNIQUE (message_sid);


--
-- Name: twilio_messages twilio_messages_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.twilio_messages
    ADD CONSTRAINT twilio_messages_pkey PRIMARY KEY (id);


--
-- Name: user_guides user_guides_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_guides
    ADD CONSTRAINT user_guides_pkey PRIMARY KEY (id);


--
-- Name: user_tickets user_tickets_invoice_no_key; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key1; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key1 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key10; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key10 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key11; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key11 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key12; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key12 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key13; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key13 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key14; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key14 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key15; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key15 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key16; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key16 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key17; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key17 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key18; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key18 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key19; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key19 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key2; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key2 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key20; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key20 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key21; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key21 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key22; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key22 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key23; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key23 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key24; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key24 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key25; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key25 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key26; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key26 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key27; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key27 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key28; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key28 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key29; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key29 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key3; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key3 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key30; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key30 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key31; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key31 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key32; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key32 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key33; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key33 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key34; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key34 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key35; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key35 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key36; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key36 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key37; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key37 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key38; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key38 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key39; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key39 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key4; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key4 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key40; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key40 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key41; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key41 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key42; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key42 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key43; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key43 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key44; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key44 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key45; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key45 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key46; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key46 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key47; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key47 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key5; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key5 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key6; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key6 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key7; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key7 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key8; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key8 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_invoice_no_key9; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_invoice_no_key9 UNIQUE (invoice_no);


--
-- Name: user_tickets user_tickets_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: tickets_counter_id; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX tickets_counter_id ON public.tickets USING btree (counter_id);


--
-- Name: tickets_created_at; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX tickets_created_at ON public.tickets USING btree ("createdAt");


--
-- Name: transactions_counter_id; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX transactions_counter_id ON public.transactions USING btree (counter_id);


--
-- Name: transactions_created_at; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX transactions_created_at ON public.transactions USING btree ("createdAt");


--
-- Name: transactions_ticket_id; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX transactions_ticket_id ON public.transactions USING btree (ticket_id);


--
-- Name: twilio_messages_createdAt; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX "twilio_messages_createdAt" ON public.twilio_messages USING btree ("createdAt");


--
-- Name: twilio_messages_direction; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX twilio_messages_direction ON public.twilio_messages USING btree (direction);


--
-- Name: twilio_messages_from; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX twilio_messages_from ON public.twilio_messages USING btree ("from");


--
-- Name: twilio_messages_status; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX twilio_messages_status ON public.twilio_messages USING btree (status);


--
-- Name: twilio_messages_to; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX twilio_messages_to ON public.twilio_messages USING btree ("to");


--
-- Name: user_tickets_created_at; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX user_tickets_created_at ON public.user_tickets USING btree ("createdAt");


--
-- Name: user_tickets_guide_name; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX user_tickets_guide_name ON public.user_tickets USING btree (guide_name);


--
-- Name: user_tickets_guide_number; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX user_tickets_guide_number ON public.user_tickets USING btree (guide_number);


--
-- Name: user_tickets_invoice_no; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX user_tickets_invoice_no ON public.user_tickets USING btree (invoice_no);


--
-- Name: user_tickets_user_id; Type: INDEX; Schema: public; Owner: santhoshh
--

CREATE INDEX user_tickets_user_id ON public.user_tickets USING btree (user_id);


--
-- Name: Transactions Transactions_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public."Transactions"
    ADD CONSTRAINT "Transactions_ticket_id_fkey" FOREIGN KEY (ticket_id) REFERENCES public."Tickets"(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: messages messages_counter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.messages
    ADD CONSTRAINT messages_counter_id_fkey FOREIGN KEY (counter_id) REFERENCES public.counters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: special_tickets special_tickets_counter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.special_tickets
    ADD CONSTRAINT special_tickets_counter_id_fkey FOREIGN KEY (counter_id) REFERENCES public.counters(id) ON UPDATE CASCADE;


--
-- Name: tickets tickets_counter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.tickets
    ADD CONSTRAINT tickets_counter_id_fkey FOREIGN KEY (counter_id) REFERENCES public.counters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transactions transactions_counter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_counter_id_fkey FOREIGN KEY (counter_id) REFERENCES public.counters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: transactions transactions_ticket_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.transactions
    ADD CONSTRAINT transactions_ticket_id_fkey FOREIGN KEY (ticket_id) REFERENCES public.tickets(id) ON UPDATE CASCADE;


--
-- Name: user_tickets user_tickets_counter_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: santhoshh
--

ALTER TABLE ONLY public.user_tickets
    ADD CONSTRAINT user_tickets_counter_id_fkey FOREIGN KEY (counter_id) REFERENCES public.counters(id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: DEFAULT PRIVILEGES FOR SEQUENCES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO santhosh;


--
-- Name: DEFAULT PRIVILEGES FOR FUNCTIONS; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON FUNCTIONS TO santhosh;


--
-- Name: DEFAULT PRIVILEGES FOR TABLES; Type: DEFAULT ACL; Schema: public; Owner: postgres
--

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO santhosh;


--
-- PostgreSQL database dump complete
--


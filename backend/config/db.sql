create database mcs;
use mcs;


create table clients (
    id int not null auto_increment,
    name varchar(255) not null,
    primary key (id)
);

create table accounts (
    id int not null auto_increment,
    username varchar(255) not null,
    password varchar(255) not null,
    email varchar(255) not null,
    client_id int not null,
    primary key (id),
    foreign key (client_id) references clients(id)
);

create table groups (
    id int not null auto_increment,
    name varchar(255) not null,
    client_id int not null,
    primary key (id),
    active boolean not null default true,
    foreign key (client_id) references clients(id)
);

create table users (
    id int not null auto_increment,
    name varchar(255) not null,
    surname varchar(255) not null,
    email varchar(255) not null,
    phone_number varchar(9) not null,
    active boolean not null default true,
    cliend_id int not null,
    primary key (id),
    foreign key (client_id) references clients(id),
);

create table groups_users (
    user_id int not null,
    group_id int not null,
    foreign key (user_id) references users(id),
    foreign key (group_id) references groups(id)
);

create table messages (
    id int not null auto_increment,
    type varchar(255) not null,
    title varchar(255) not null,
    content text not null,
    account_id int not null,
    date datetime not null,
    primary key (id)
    foreign key (account_id) references accounts(id)
);

create table messages_groups (
    message_id int not null,
    group_id int not null,
    foreign key (message_id) references messages(id),
    foreign key (group_id) references groups(id)
);


-- on entry into /groups
-- select * from groups;
-- left join groups_users on groups.id = groups_users.group_id
-- left join users on groups_users.user_id = users.id
-- where groups.active = true and users.active = true and client_id = zmienna

-- get all users
-- select * from users where active = true and cliend_id = zmienna

-- alter table messages_groups add field type varchar(255) not null default 'group';
alter table users add field client_id int not null;
alter table users add foreign key (client_id) references clients(id);

Dave	Kupyn	davidkupyn@gmail.com	728793264	1

Dave	Kupyn	davidkupyn@gmail.com	728793264	1	0
Wiktor	Pawlikowski	wikpaw@techni.com		0	0
Mateusz	Kozlowski	matt@technischools.com		1	0
Wiktor	Pawlikowski	u11_wikpaw_waw@technischools.com	788933937	1	0


update users set client_id = 1 where id = 1;

-- join groups and messages_groups with id depending on message id
 select * from groups left join messages_groups on groups.id = messages_groups.group_id where messages_groups.message_id = 1;
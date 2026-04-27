create 
DATABASE x_db;
use x_db;
set GLOBAL time_zone = "+00:00";
select @@GLOBAL.time_zone, @@session.time_zone;
create table users(
    user_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    display_name varchar(50) not NULL,
    user_name VARCHAR(50) UNIQUE not null,
    email varchar(50) not null,
    password VARCHAR(150) not null,
    country varchar(50),
    profile_image VARCHAR(150),
    cover_image varchar(150),
    bio text DEFAULT NULL,
    date_of_birth DATE,
    is_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
create table tweets(
    tweet_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT not null,
    content text DEFAULT null,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    Foreign Key (user_id) REFERENCES users(user_id) on delete CASCADE
);

create table tweet_media(
    media_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    tweet_id BIGINT,
    media_type VARCHAR(50),
    media VARCHAR(150),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Foreign Key (tweet_id) REFERENCES tweets(tweet_id) on delete CASCADE
);

create Table retweet(
    user_id BIGINT,
    tweet_id BIGINT,
    
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY(user_id, tweet_id),
    Foreign Key (user_id) REFERENCES users(user_id) on delete CASCADE,
    Foreign Key (tweet_id) REFERENCES tweets(tweet_id) on delete CASCADE
);

create table reactions(
    user_id BIGINT ,
    tweet_id BIGINT,
    is_liked BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
     PRIMARY key(user_id, tweet_id),
    Foreign Key (tweet_id) REFERENCES tweets(tweet_id) on delete CASCADE,
    Foreign Key (user_id) REFERENCES users(user_id) on delete CASCADE
);
create table comments(
    comment_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    tweet_id BIGINT,
    content text,
    parent_comment_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
Foreign Key (parent_comment_id) REFERENCES comments(comment_id)on delete set null,
    Foreign Key (user_id) REFERENCES users(user_id),
    Foreign Key (tweet_id) REFERENCES tweets(tweet_id)
);
create table comment_reactions(
    user_id BIGINT,
    comment_id BIGINT,
    is_liked BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

     PRIMARY KEY(user_id, comment_id),
    Foreign Key (user_id) REFERENCES users(user_id) on delete CASCADE,
    Foreign Key (comment_id) REFERENCES comments(comment_id) on delete CASCADE
);
create Table notifications(
    notification_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT,
    actor_id BIGINT,
    tweet_id BIGINT,
    comment_id BIGINT,
    content VARCHAR(100),
    notification_type VARCHAR(40),
    is_read BOOLEAN DEFAULT False,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    Foreign Key (user_id) REFERENCES users(user_id) on delete CASCADE,
    Foreign Key (actor_id) REFERENCES users(user_id) on delete CASCADE,
    Foreign Key (tweet_id) REFERENCES tweets(tweet_id) on delete set null,
    Foreign Key (comment_id) REFERENCES comments(comment_id) on delete set null
);
create table follows(
follower_id bigint not null,
followee_id bigint not null,
created_at timestamp default current_timestamp,
primary key(follower_id,followee_id), 
foreign key (follower_id) references users(user_id) on delete cascade,
foreign key (followee_id) references users(user_id) on delete cascade
);

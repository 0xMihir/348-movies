
CREATE DATABASE IF NOT EXISTS cs348_movies;

USE cs348_movies;

CREATE TABLE IF NOT EXISTS Genres (
  id   INT          NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_genre_name (name)
);

CREATE TABLE IF NOT EXISTS Movies (
  id           INT          NOT NULL AUTO_INCREMENT,
  title        VARCHAR(255) NOT NULL,
  director     VARCHAR(255),
  genre_id     INT,
  release_year SMALLINT,
  duration_min SMALLINT,
  language     VARCHAR(50)  DEFAULT 'English',
  synopsis     TEXT,
  created_at   TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_movies_genre FOREIGN KEY (genre_id) REFERENCES Genres (id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS Reviews (
  id            INT          NOT NULL AUTO_INCREMENT,
  movie_id      INT          NOT NULL,
  reviewer_name VARCHAR(100) NOT NULL,
  rating        TINYINT      NOT NULL,
  review_text   TEXT,
  review_date   DATE         NOT NULL,
  PRIMARY KEY (id),
  CONSTRAINT fk_reviews_movie FOREIGN KEY (movie_id) REFERENCES Movies (id) ON DELETE CASCADE,
  CONSTRAINT chk_rating CHECK (rating BETWEEN 1 AND 10)
);


CREATE INDEX idx_movies_genre ON Movies (genre_id);

CREATE INDEX idx_movies_year ON Movies (release_year);

CREATE INDEX idx_reviews_movie ON Reviews (movie_id);

CREATE INDEX idx_reviews_date ON Reviews (review_date);

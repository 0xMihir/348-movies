-- CS348 Project: Movie Review Tracker — Seed Data
USE cs348_movies;

-- ─────────────────────────────────────────────
-- Genres
-- ─────────────────────────────────────────────
INSERT IGNORE INTO Genres (name) VALUES
  ('Action'),
  ('Comedy'),
  ('Drama'),
  ('Horror'),
  ('Sci-Fi'),
  ('Thriller'),
  ('Romance'),
  ('Animation'),
  ('Documentary'),
  ('Fantasy'),
  ('Mystery'),
  ('Adventure'),
  ('Crime'),
  ('Biography'),
  ('Musical');

-- ─────────────────────────────────────────────
-- Movies
-- ─────────────────────────────────────────────
INSERT INTO Movies (title, director, genre_id, release_year, duration_min, language, synopsis) VALUES
  ('The Dark Knight',        'Christopher Nolan',  (SELECT id FROM Genres WHERE name='Action'),      2008, 152, 'English', 'Batman faces the Joker, a criminal mastermind who plunges Gotham into anarchy.'),
  ('Inception',              'Christopher Nolan',  (SELECT id FROM Genres WHERE name='Sci-Fi'),       2010, 148, 'English', 'A thief who enters dreams to steal secrets is given the inverse task of planting an idea.'),
  ('The Shawshank Redemption','Frank Darabont',    (SELECT id FROM Genres WHERE name='Drama'),        1994, 142, 'English', 'Two imprisoned men bond over years, finding solace and redemption through acts of decency.'),
  ('Pulp Fiction',           'Quentin Tarantino',  (SELECT id FROM Genres WHERE name='Crime'),        1994, 154, 'English', 'The lives of two mob hitmen, a boxer, a gangster and his wife intertwine in tales of violence.'),
  ('Interstellar',           'Christopher Nolan',  (SELECT id FROM Genres WHERE name='Sci-Fi'),       2014, 169, 'English', 'Astronauts travel through a wormhole in search of a new home for humanity.'),
  ('Parasite',               'Bong Joon-ho',       (SELECT id FROM Genres WHERE name='Thriller'),     2019, 132, 'Korean',  'A poor family schemes to become employed by a wealthy family.'),
  ('Forrest Gump',           'Robert Zemeckis',    (SELECT id FROM Genres WHERE name='Drama'),        1994, 142, 'English', 'The story of a man with low IQ who accomplishes extraordinary things in his life.'),
  ('The Matrix',             'The Wachowskis',     (SELECT id FROM Genres WHERE name='Sci-Fi'),       1999, 136, 'English', 'A hacker discovers the truth about his reality and his role in the war against its controllers.'),
  ('Schindler''s List',      'Steven Spielberg',   (SELECT id FROM Genres WHERE name='Biography'),    1993, 195, 'English', 'A German businessman saves over a thousand Jewish lives during the Holocaust.'),
  ('The Godfather',          'Francis Ford Coppola',(SELECT id FROM Genres WHERE name='Crime'),       1972, 175, 'English', 'The aging patriarch of an organized crime dynasty transfers control to his reluctant son.'),
  ('La La Land',             'Damien Chazelle',    (SELECT id FROM Genres WHERE name='Musical'),      2016, 128, 'English', 'A jazz musician and an aspiring actress fall in love in Los Angeles.'),
  ('Get Out',                'Jordan Peele',       (SELECT id FROM Genres WHERE name='Horror'),       2017, 104, 'English', 'A man visits his girlfriend''s parents'' estate and discovers a disturbing secret.'),
  ('Spirited Away',          'Hayao Miyazaki',     (SELECT id FROM Genres WHERE name='Animation'),    2001, 125, 'Japanese','A girl wanders into a world ruled by gods, witches, and spirits.'),
  ('Whiplash',               'Damien Chazelle',    (SELECT id FROM Genres WHERE name='Drama'),        2014, 107, 'English', 'A young drummer enrolls at a cut-throat music conservatory under an abusive instructor.'),
  ('Coco',                   'Lee Unkrich',        (SELECT id FROM Genres WHERE name='Animation'),    2017, 105, 'English', 'A boy aspiring to be a musician is transported to the Land of the Dead.'),
  ('1917',                   'Sam Mendes',         (SELECT id FROM Genres WHERE name='Action'),       2019, 119, 'English', 'Two British soldiers must cross enemy territory to deliver a message that could save 1,600 men.'),
  ('Her',                    'Spike Jonze',        (SELECT id FROM Genres WHERE name='Sci-Fi'),       2013, 126, 'English', 'A writer falls in love with an AI operating system.'),
  ('The Silence of the Lambs','Jonathan Demme',   (SELECT id FROM Genres WHERE name='Thriller'),     1991, 118, 'English', 'An FBI trainee seeks help from a jailed cannibal killer to catch another serial killer.'),
  ('Mad Max: Fury Road',     'George Miller',      (SELECT id FROM Genres WHERE name='Action'),       2015, 120, 'English', 'In a post-apocalyptic wasteland, a woman rebels against a tyrannical ruler.'),
  ('Roma',                   'Alfonso Cuarón',     (SELECT id FROM Genres WHERE name='Drama'),        2018, 135, 'Spanish', 'A middle-class family''s maid navigates life in Mexico City in the 1970s.'),
  ('Joker',                  'Todd Phillips',      (SELECT id FROM Genres WHERE name='Thriller'),     2019, 122, 'English', 'A failed stand-up comedian descends into madness and becomes a criminal mastermind.'),
  ('Everything Everywhere All at Once','Daniel Kwan',(SELECT id FROM Genres WHERE name='Sci-Fi'),    2022, 139, 'English', 'A woman must connect with parallel universe versions of herself to save the world.'),
  ('The Grand Budapest Hotel','Wes Anderson',      (SELECT id FROM Genres WHERE name='Comedy'),       2014, 100, 'English', 'The adventures of a legendary concierge at a famous hotel between the wars.'),
  ('Gone Girl',              'David Fincher',      (SELECT id FROM Genres WHERE name='Mystery'),      2014, 149, 'English', 'A man becomes the prime suspect when his wife suddenly disappears.'),
  ('Black Swan',             'Darren Aronofsky',   (SELECT id FROM Genres WHERE name='Thriller'),     2010, 108, 'English', 'A ballet dancer wins the role of the Swan Queen but is threatened by a rival.'),
  ('Knives Out',             'Rian Johnson',       (SELECT id FROM Genres WHERE name='Mystery'),      2019, 131, 'English', 'A detective investigates the death of the patriarch of a wealthy family.'),
  ('Soul',                   'Pete Docter',        (SELECT id FROM Genres WHERE name='Animation'),    2020, 101, 'English', 'A jazz musician accidentally falls into the Great Before and must find his way back.'),
  ('Dune',                   'Denis Villeneuve',   (SELECT id FROM Genres WHERE name='Sci-Fi'),       2021, 155, 'English', 'A noble family becomes embroiled in a war for a desert planet.'),
  ('The Witch',              'Robert Eggers',      (SELECT id FROM Genres WHERE name='Horror'),       2015,  92, 'English', 'A Puritan family encounters evil forces in colonial New England.'),
  ('Moonlight',              'Barry Jenkins',      (SELECT id FROM Genres WHERE name='Drama'),        2016, 111, 'English', 'A young man grows up in Miami, struggling with identity and sexuality.');

-- ─────────────────────────────────────────────
-- Reviews
-- ─────────────────────────────────────────────
INSERT INTO Reviews (movie_id, reviewer_name, rating, review_text, review_date) VALUES
  (1, 'Alice',   10, 'Masterpiece. Heath Ledger is unforgettable.',          '2023-01-10'),
  (1, 'Bob',      9, 'One of the best superhero films ever made.',           '2023-02-14'),
  (1, 'Carlos',  10, 'The Joker steals every scene.',                        '2023-03-05'),
  (2, 'Diana',    9, 'Mind-bending from start to finish.',                   '2023-01-20'),
  (2, 'Eve',      8, 'Complex but rewarding on rewatch.',                    '2023-04-11'),
  (3, 'Frank',   10, 'The most uplifting film about hope.',                  '2023-02-01'),
  (3, 'Grace',    9, 'Morgan Freeman and Tim Robbins are perfect.',          '2023-05-15'),
  (4, 'Hank',     9, 'Tarantino at his best. Dialogue is poetry.',           '2023-03-22'),
  (4, 'Iris',     8, 'Unconventional structure pays off brilliantly.',       '2023-06-07'),
  (5, 'Jack',    10, 'Hans Zimmer''s score alone is worth watching.',        '2023-01-30'),
  (5, 'Kate',     9, 'Emotionally devastating and scientifically intriguing.','2023-04-20'),
  (6, 'Leo',     10, 'Best film of 2019. The ending is a gut punch.',        '2023-02-28'),
  (6, 'Mia',      9, 'Bong Joon-ho is a genius.',                           '2023-07-01'),
  (7, 'Ned',      8, 'Tom Hanks gives a career-best performance.',           '2023-03-10'),
  (7, 'Olivia',   9, 'A gentle giant of cinema.',                            '2023-05-20'),
  (8, 'Pete',    10, 'Changed the game for sci-fi action.',                  '2023-01-05'),
  (8, 'Quinn',    9, 'The red pill/blue pill scene is iconic.',              '2023-06-15'),
  (9, 'Rachel',  10, 'Devastating and essential viewing.',                   '2023-02-10'),
  (10,'Sam',     10, 'The definitive crime epic.',                           '2023-04-05'),
  (10,'Tina',     9, 'Brando is extraordinary.',                             '2023-07-20'),
  (11,'Uma',      8, 'Beautiful love letter to jazz and Los Angeles.',       '2023-03-15'),
  (11,'Victor',   7, 'Gorgeous but the ending felt rushed.',                 '2023-08-01'),
  (12,'Wendy',    9, 'Deeply unsettling in the best way.',                   '2023-04-25'),
  (13,'Xander',  10, 'A work of pure imagination.',                          '2023-05-05'),
  (14,'Yara',    10, 'J.K. Simmons is terrifying. Intense from first scene.','2023-06-20'),
  (14,'Zane',     9, 'The final drumming scene is one for the ages.',       '2023-09-01'),
  (15,'Alice',    9, 'Made me cry. Pixar at its finest.',                   '2023-07-10'),
  (16,'Bob',      9, 'One continuous shot. Absolutely breathtaking.',        '2023-08-15'),
  (17,'Carlos',   8, 'Joaquin Phoenix is heartbreaking and funny.',          '2023-09-20'),
  (18,'Diana',    9, 'Jodie Foster is magnificent.',                         '2023-10-05'),
  (19,'Eve',      8, 'Relentless action, incredible practical effects.',     '2023-11-01'),
  (20,'Frank',    9, 'Quiet and profound. Alfonso Cuarón''s best.',          '2023-12-10'),
  (21,'Grace',    8, 'Joaquin Phoenix is genuinely terrifying.',             '2024-01-05'),
  (22,'Hank',    10, 'One of the most inventive films of the decade.',       '2024-02-14'),
  (23,'Iris',     9, 'Wes Anderson''s most charming film.',                 '2024-03-01'),
  (24,'Jack',     8, 'Rosamund Pike is chilling.',                          '2024-04-10'),
  (25,'Kate',     8, 'Natalie Portman disappears into the role.',            '2024-05-05'),
  (26,'Leo',      9, 'Hugely entertaining whodunit.',                       '2024-06-20'),
  (27,'Mia',      9, 'Pixar tackles existentialism beautifully.',            '2024-07-15'),
  (28,'Ned',      8, 'Stunning world-building, though it ends mid-story.',  '2024-08-01'),
  (29,'Olivia',   8, 'Atmospheric and creepy.',                              '2024-09-10'),
  (30,'Pete',     9, 'A quiet revolution in queer cinema.',                  '2024-10-20');

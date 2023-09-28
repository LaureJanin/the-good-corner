PRAGMA foreign_keys = ON;

CREATE TABLE Ad (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    owner VARCHAR(100) NOT NULL,
    price INTEGER,
    picture VARCHAR(100),
    location VARCHAR(100),
    createdAt DATE NOT NULL,
    categoryId INTEGER,
    FOREIGN KEY (categoryId) REFERENCES Category(id)
);

CREATE TABLE Category (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(100) NOT NULL
);

INSERT INTO Ad (title, description, owner, price, picture, location, createdAt, categoryId)
VALUES
('Ford Mustang GT', 'Superbe Ford Mustang GT en excellent état', 'Propriétaire 1', 35000, 'image1.jpg', 'Los Angeles', '2023-09-01', 2),
('Trench-coat élégant', 'Trench-coat élégant pour hommes', 'Propriétaire 2', 150, 'image2.jpg', 'New York', '2023-09-01', 1),
('Mercedes-Benz C300', 'Élégante Mercedes-Benz C300 avec équipements de luxe', 'Propriétaire 3', 45000, 'image3.jpg', 'Miami', '2023-09-18', 2),
('Jeep Wrangler Sahara', 'Jeep Wrangler Sahara prête pour le tout-terrain', 'Propriétaire 4', 28000, 'image4.jpg', 'Denver', '2023-09-17', 2),
('Veste en cuir vintage', 'Veste en cuir vintage pour femmes, style rétro', 'Propriétaire 5', 120, 'image5.jpg', 'Chicago', '2023-09-16', 1),
('Tesla Model S', 'Tesla Model S électrique à la pointe de la technologie', 'Propriétaire 6', 60000, 'image6.jpg', 'San Francisco', '2023-09-15', 2),
('BMW X5', 'BMW X5 puissante avec espace pour toute la famille', 'Propriétaire 7', 42000, 'image7.jpg', 'Dallas', '2023-09-01', 3),
('Chemise en soie', 'Chemise en soie de haute qualité pour hommes', 'Propriétaire 8', 80, 'image8.jpg', 'Seattle', '2023-09-01', 1),
('Lexus RX 350', 'Lexus RX 350 luxueuse avec intérieur en cuir', 'Propriétaire 9', 38000, 'image9.jpg', 'Houston', '2023-09-18', 2),
('Subaru Outback', 'Subaru Outback robuste pour les aventures en plein air', 'Propriétaire 10', 27000, 'image10.jpg', 'Phoenix', '2023-09-17', 2),
('Robe de soirée élégante', 'Robe de soirée élégante pour femmes, parfaite pour les occasions spéciales', 'Propriétaire 11', 150, 'image11.jpg', 'San Diego', '2023-09-16', 1),
('Chevrolet Silverado', 'Chevrolet Silverado robuste pour les travaux lourds', 'Propriétaire 12', 32000, 'image12.jpg', 'Austin', '2023-09-15', 2),
('Appartement en bord de mer', 'Appartement en bord de mer avec vue', 'Propriétaire 20', 2500, 'image20.jpg', 'San Diego', '2023-09-01', 3),
('Vélo de montagne haut de gamme', 'Vélo de montagne haut de gamme avec suspension avancée', 'Propriétaire 21', 1200, 'image21.jpg', 'Phoenix', '2023-09-18', 3),
('Appartement en duplex', 'Appartement en duplex avec terrasse privée', 'Propriétaire 22', 2800, 'image22.jpg', 'Dallas', '2023-09-17', 3),
('Vélo de course professionnel', 'Vélo de course professionnel pour les compétitions', 'Propriétaire 23', 1500, 'image23.jpg', 'Seattle', '2023-09-16', 3),
('Appartement de charme', 'Appartement de charme avec poutres apparentes', 'Propriétaire 24', 1600, 'image24.jpg', 'Houston', '2023-09-15', 3);

INSERT INTO Category (name)
VALUES
('Vetement'),
('Voiture'),
('Autre')

SELECT * FROM Ad;

SELECT * FROM Category;

SELECT * FROM Ad WHERE location ="Bordeaux";

SELECT a.*, c.name AS categoryName FROM Ad AS a LEFT JOIN Category AS c ON C.id = A.categoryId;

DELETE FROM Ad WHERE price > 40;

UPDATE Ad SET price = 0 WHERE createdAt = '2023-09-01';

SELECT AVG(price) AS moy_price FROM Ad WHERE location = 'Paris';

SELECT location, AVG(price) AS moy_price FROM Ad GROUP BY location;

DELETE FROM Ad;

SELECT Ad.* FROM Ad
JOIN Category ON Ad.categoryId = Category.id
WHERE Category.name = 'Vetement';

SELECT Ad.* FROM Ad
JOIN Category ON Ad.categoryId = Category.id
WHERE Category.name IN ('Vetement', 'Voiture');

SELECT AVG(Ad.price) AS PrixMoyenAutre
FROM Ad
JOIN Category ON Ad.categoryId = Category.id
WHERE Category.name = 'Autre';

SELECT Ad.*
FROM Ad
JOIN Category ON Ad.categoryId = Category.id
WHERE Category.name LIKE 'V%';
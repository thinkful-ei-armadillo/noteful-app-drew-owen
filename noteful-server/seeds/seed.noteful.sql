-- psql -U dev -d noteful -f ./seeds/seed.noteful.sql
-- psql -U dev -d noteful-test -f ./seeds/seed.noteful.sql

insert into folders (folders_name)
values ('folder 1'), ('important'),('urgent'),('TS/SCI'),('CBI');

insert into notes (notes_name, content, folders_id)
values
('Dogs', 'Corporis accusamus placeat', 1),
('Cats', 'Corporis accusamus placeat', 1),
('Dogs in motion', 'Corporis accusamus placeat', 2),
('Cats in motion', 'Corporis accusamus placeat', 1);
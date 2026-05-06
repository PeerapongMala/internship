BEGIN TRANSACTION;


INSERT INTO inventory.inventory
( student_id, gold_coin, arcade_coin, ice)
VALUES( 'cd1592be-7302-4805-a172-86956b0bf2a1', 100, 203, 3);

COMMIT;
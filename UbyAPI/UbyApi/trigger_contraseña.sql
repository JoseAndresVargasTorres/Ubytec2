 TRIGGER [dbo].[trig_contraseña]
ON [dbo].[Cliente]
AFTER INSERT
AS
BEGIN
   
    UPDATE Cliente
    SET password = CONVERT(nvarchar(64), HASHBYTES('SHA2_256', I.password), 2)
    FROM Cliente C
    INNER JOIN INSERTED I ON C.cedula = I.cedula;
END;
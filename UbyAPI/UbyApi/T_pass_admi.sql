USE [ubybase]
GO
/****** Object:  Trigger [dbo].[trig_contraseña_administrador]    Script Date: 21/11/2024 18:43:59 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TRIGGER [dbo].[trig_contraseña_administrador]
ON [dbo].[Administrador]
AFTER INSERT, UPDATE 
AS
BEGIN
    UPDATE Administrador
    SET password = CONVERT(nvarchar(64), HASHBYTES('SHA2_256', I.password), 2)
    FROM Administrador A
    INNER JOIN INSERTED I ON A.cedula = I.cedula;
END;






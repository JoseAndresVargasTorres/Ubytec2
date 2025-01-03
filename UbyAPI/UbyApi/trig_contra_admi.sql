USE [ubybase]
GO
/****** Object:  Trigger [dbo].[trig_contraseña_administrador]    Script Date: 20/11/2024 17:55:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER TRIGGER [dbo].[trig_contraseña_administrador]
ON [dbo].[Administrador]
AFTER INSERT
AS
BEGIN
    UPDATE Administrador
    SET password = CONVERT(nvarchar(64), HASHBYTES('SHA2_256', I.password), 2)
    FROM Administrador A
    INNER JOIN INSERTED I ON A.cedula = I.cedula;
END;

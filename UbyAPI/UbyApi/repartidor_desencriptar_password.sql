create PROCEDURE clave_repartidor
    @Usuario  NVARCHAR(50),
    @Password NVARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;

    -- Crear el hash de la contraseña ingresada
    DECLARE @HashPassword NVARCHAR(64) = CONVERT(NVARCHAR(64), HASHBYTES('SHA2_256', @Password), 2);

    -- Verificar si el usuario y la contraseña hash coinciden
    IF EXISTS (
        SELECT 1
        FROM Repartidor
        WHERE usuario = @Usuario AND password = @HashPassword
    )
    BEGIN
        PRINT 'Autenticación exitosa.';
        -- Opcional: Devolver los datos del repartidor si la autenticación es válida
        SELECT 
            *
        FROM Repartidor
        WHERE usuario = @Usuario;
    END
    ELSE
    BEGIN
        -- Retornar valores por defecto en caso de fallo de autenticación
        SELECT -1 AS id,
               '-1' AS usuario,
               '-1' AS password,
               '-1' AS nombre,
               '-1' AS apellido1,
               '-1' AS apellido2,
               '-1' AS correo,
			   GETDATE() AS fecha_nacimiento;
    END 
END;
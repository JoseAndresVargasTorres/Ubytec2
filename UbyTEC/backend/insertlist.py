from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from sqlalchemy import inspect

def create_tables():
    """Crear todas las tablas definidas en los modelos"""
    models.Base.metadata.create_all(bind=engine)

def tables_exist():
    """Verificar si todas las tablas necesarias existen"""
    inspector = inspect(engine)
    required_tables = [
        'administrador',
        'direccionesadministrador',
        'telefonosadministrador',
        'tipo_comercio',
        'comercio',
        'direccionescomercioafiliado',
        'telefonocomercioafiliado'
    ]
    existing_tables = inspector.get_table_names()
    return all(table in existing_tables for table in required_tables)

def init_database():
    """Inicializar la base de datos con datos de prueba"""
    # Primero, asegurarse de que las tablas existan
    if not tables_exist():
        create_tables()

    db = SessionLocal()
    try:
        # Verificar si ya existen datos
        if db.query(models.Administrador).first() is not None:
            print("La base de datos ya contiene datos. Saltando la inicialización.")
            return

        # Crear administradores
        administradores = [
            models.Administrador(
                cedula="101110111",
                usuario="admin1",
                password="pass123",
                nombre="Juan",
                apellido1="Pérez",
                apellido2="García"
            ),
            models.Administrador(
                cedula="202220222",
                usuario="admin2",
                password="pass456",
                nombre="María",
                apellido1="González",
                apellido2="López"
            ),
            models.Administrador(
                cedula="303330333",
                usuario="admin3",
                password="pass789",
                nombre="Carlos",
                apellido1="Rodríguez",
                apellido2="Martínez"
            ),
            models.Administrador(
                cedula="404440444",
                usuario="admin4",
                password="pass012",
                nombre="Ana",
                apellido1="Fernández",
                apellido2="Sánchez"
            )
        ]

        # Insertar administradores
        for admin in administradores:
            db.add(admin)
        db.commit()

        # Crear direcciones de administradores
        direcciones_admin = [
            models.Direccion_Administrador(
                id_admin="101110111",
                provincia="San José",
                canton="Central",
                distrito="Catedral"
            ),
            models.Direccion_Administrador(
                id_admin="202220222",
                provincia="Alajuela",
                canton="Central",
                distrito="San José"
            ),
            models.Direccion_Administrador(
                id_admin="303330333",
                provincia="Heredia",
                canton="Central",
                distrito="Mercedes"
            ),
            models.Direccion_Administrador(
                id_admin="404440444",
                provincia="Cartago",
                canton="Central",
                distrito="Oriental"
            )
        ]

        # Insertar direcciones
        for direccion in direcciones_admin:
            db.add(direccion)
        db.commit()

        # Crear teléfonos de administradores
        telefonos_admin = []
        for admin in administradores:
            for i in range(3):
                telefono = models.Telefonos_Administrador(
                    telefono=f"8{admin.cedula[:3]}{i+1}2345",
                    cedula_admin=admin.cedula
                )
                telefonos_admin.append(telefono)

        # Insertar teléfonos
        for telefono in telefonos_admin:
            db.add(telefono)
        db.commit()

        # Crear tipos de comercio
        tipos_comercio = [
            models.Tipo_Comercio(nombre="Restaurante"),
            models.Tipo_Comercio(nombre="Supermercado"),
            models.Tipo_Comercio(nombre="Farmacia"),
            models.Tipo_Comercio(nombre="Tienda de ropa")
        ]

        # Insertar tipos de comercio
        for tipo in tipos_comercio:
            db.add(tipo)
        db.commit()

        # Refrescar tipos para obtener sus IDs
        for tipo in tipos_comercio:
            db.refresh(tipo)

        # Crear comercios afiliados
        comercios = [
            models.Comercio_afiliado(
                cedula_juridica="3101111111",
                nombre="Restaurante El Buen Sabor",
                correo="buensabor@email.com",
                SINPE="8111111111",
                id_tipo=tipos_comercio[0].ID,
                cedula_admin=administradores[0].cedula
            ),
            models.Comercio_afiliado(
                cedula_juridica="3102222222",
                nombre="Super Economico",
                correo="supereconomico@email.com",
                SINPE="8222222222",
                id_tipo=tipos_comercio[1].ID,
                cedula_admin=administradores[1].cedula
            ),
            models.Comercio_afiliado(
                cedula_juridica="3103333333",
                nombre="Farmacia Salud Total",
                correo="saludtotal@email.com",
                SINPE="8333333333",
                id_tipo=tipos_comercio[2].ID,
                cedula_admin=administradores[2].cedula
            ),
            models.Comercio_afiliado(
                cedula_juridica="3104444444",
                nombre="Modas Elegantes",
                correo="modaselegantes@email.com",
                SINPE="8444444444",
                id_tipo=tipos_comercio[3].ID,
                cedula_admin=administradores[3].cedula
            )
        ]

        # Insertar comercios
        for comercio in comercios:
            db.add(comercio)
        db.commit()

        # Crear direcciones de comercios
        direcciones_comercio = [
            models.Direccion_Comercio(
                id_comercio="3101111111",
                provincia="San José",
                canton="Escazú",
                distrito="San Rafael"
            ),
            models.Direccion_Comercio(
                id_comercio="3102222222",
                provincia="Alajuela",
                canton="Grecia",
                distrito="Central"
            ),
            models.Direccion_Comercio(
                id_comercio="3103333333",
                provincia="Heredia",
                canton="Santo Domingo",
                distrito="Santa Rosa"
            ),
            models.Direccion_Comercio(
                id_comercio="3104444444",
                provincia="Cartago",
                canton="La Unión",
                distrito="Tres Ríos"
            )
        ]

        # Insertar direcciones de comercios
        for direccion in direcciones_comercio:
            db.add(direccion)
        db.commit()

        # Crear teléfonos de comercios
        telefonos_comercio = []
        for comercio in comercios:
            for i in range(3):
                telefono = models.Telefono_Comercio(
                    telefono=f"2{comercio.cedula_juridica[3:6]}{i+1}4567",
                    cedula_comercio=comercio.cedula_juridica
                )
                telefonos_comercio.append(telefono)

        # Insertar teléfonos de comercios
        for telefono in telefonos_comercio:
            db.add(telefono)
        db.commit()

        print("Base de datos inicializada exitosamente con datos de prueba.")

    except Exception as e:
        print(f"Error durante la inicialización de la base de datos: {str(e)}")
        db.rollback()
        raise e
    finally:
        db.close()

if __name__ == "__main__":
    init_database()

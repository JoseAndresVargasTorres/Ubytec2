from fastapi import FastAPI, HTTPException, Depends, status
from pydantic import BaseModel, Field, EmailStr
from typing import Annotated, Optional, List
import models
from database import engine, SessionLocal
from sqlalchemy.orm import Session
from decimal import Decimal
from fastapi.middleware.cors import CORSMiddleware
from flask_cors import CORS
from insertlist import init_database

# Inicialización de la aplicación
app = FastAPI()

# Definición de tags para la documentación
tags_metadata = [
    {
        "name": "Administradores",
        "description": "Operaciones relacionadas con administradores, incluyendo sus direcciones y teléfonos"
    },
    {
        "name": "Comercios Afiliados",
        "description": "Operaciones relacionadas con comercios afiliados, incluyendo sus direcciones y teléfonos"
    },
    {
        "name": "Tipos de Comercio",
        "description": "Gestión de los diferentes tipos de comercio disponibles"
    },
    {
        "name": "Repartidores",
        "description": "Operaciones relacionadas con la gestión de repartidores, incluyendo sus direcciones y teléfonos"
    }
]

app.openapi_tags = tags_metadata

init_database()  # Inicializar la base de datos con datos de prueba
models.Base.metadata.create_all(bind=engine)

# Configuración de CORS
origins = [
    "http://localhost:4200",  # URL de la aplicación Angular
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)




#######################
# Modelos de Pydantic #
#######################

# Modelos para Administrador
class AdministradorBase(BaseModel):
    cedula: str = Field(..., max_length=20)
    usuario: str = Field(..., max_length=50)
    password: str = Field(..., max_length=100)
    nombre: str = Field(..., max_length=100)
    apellido1: str = Field(..., max_length=100)
    apellido2: str = Field(..., max_length=100)

class DireccionesAdministradorBase(BaseModel):
    id_admin: str = Field(..., max_length=20)
    provincia: str = Field(..., max_length=100)
    canton: str = Field(..., max_length=100)
    distrito: str = Field(..., max_length=100)

class TelefonosAdministradorBase(BaseModel):
    telefono: str = Field(..., max_length=20)
    cedula_admin: str = Field(..., max_length=100)

# Modelos para Comercio Afiliado
class ComercioAfiliadoBase(BaseModel):
    cedula_juridica: str = Field(..., max_length=20)
    nombre: str = Field(..., max_length=100)
    correo: EmailStr
    SINPE: str = Field(..., max_length=50)
    id_tipo: int
    cedula_admin: str = Field(..., max_length=20)

class TipoComercioBase(BaseModel):
    ID: int
    nombre: str = Field(..., max_length=100)

class TelefonosComercioAfiliadoBase(BaseModel):
    telefono: str = Field(..., max_length=20)
    cedula_comercio: str = Field(..., max_length=100)

class DireccionesComercioBase(BaseModel):
    id_comercio: str = Field(..., max_length=20)
    provincia: str = Field(..., max_length=100)
    canton: str = Field(..., max_length=100)
    distrito: str = Field(..., max_length=100)

#######################
# Modelos de Pydantic #
#######################

# # Modelos para Repartidor
# class RepartidorBase(BaseModel):
#     usuario: str = Field(..., max_length=50)
#     nombre: str = Field(..., max_length=100)
#     apellido1: str = Field(..., max_length=100)
#     apellido2: str = Field(..., max_length=100)
#     correo: EmailStr

# class DireccionRepartidorBase(BaseModel):
#     id_repartidor: int
#     provincia: str = Field(..., max_length=100)
#     canton: str = Field(..., max_length=100)
#     distrito: str = Field(..., max_length=100)

# class TelefonoRepartidorBase(BaseModel):
#     cedula_repartidor: int
#     telefono: str = Field(..., max_length=50)



# Configuración de la base de datos
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

################################
# Endpoints para Administrador  #
################################

# CREATE - Administrador
@app.post("/admin/",
          response_model=AdministradorBase,
          status_code=status.HTTP_201_CREATED,
          tags=["Administradores"],
          summary="Crear nuevo administrador",
          response_description="Administrador creado exitosamente")
async def create_admin(admin: AdministradorBase, db: Session = Depends(get_db)):
    """
    Crea un nuevo administrador con la siguiente información: """

    new_admin = models.Administrador(
        cedula=admin.cedula,
        usuario=admin.usuario,
        password=admin.password,
        nombre=admin.nombre,
        apellido1=admin.apellido1,
        apellido2=admin.apellido2
    )
    db.add(new_admin)
    try:
        db.commit()
        db.refresh(new_admin)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el administrador")
    return new_admin

@app.post("/direccionadmin/", status_code=status.HTTP_201_CREATED,
            tags=["Administradores"],)
async def create_direccion(direccion: DireccionesAdministradorBase, db: Session = Depends(get_db)):
    """Crea una nueva dirección para un administrador"""
    new_direccion = models.Direccion_Administrador(
        id_admin=direccion.id_admin,
        provincia=direccion.provincia,
        canton=direccion.canton,
        distrito=direccion.distrito
    )
    db.add(new_direccion)
    try:
        db.commit()
        db.refresh(new_direccion)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear la dirección")
    return new_direccion

@app.post("/telefonosadmin/", status_code=status.HTTP_201_CREATED ,tags=["Administradores"])
async def create_telefono(telefono: TelefonosAdministradorBase, db: Session = Depends(get_db)):
    """Crea un nuevo teléfono para un administrador"""
    new_telefono = models.Telefonos_Administrador(
        cedula_admin=telefono.cedula_admin,
        telefono=telefono.telefono
    )
    db.add(new_telefono)
    try:
        db.commit()
        db.refresh(new_telefono)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el teléfono")
    return new_telefono

# READ - Administrador
@app.get("/admin/", response_model=List[AdministradorBase],tags=["Administradores"])
async def get_administradores(db: Session = Depends(get_db)):
    """Obtiene todos los administradores"""
    return db.query(models.Administrador).all()

@app.get("/admin/{id_admin}", response_model=AdministradorBase,tags=["Administradores"])
async def get_admin(id_admin: str, db: Session = Depends(get_db)):
    """Obtiene un administrador específico por su ID"""
    db_admin = db.query(models.Administrador).filter(models.Administrador.cedula == id_admin).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador no encontrado")
    return db_admin

@app.get("/telefonosadmin/", response_model=List[TelefonosAdministradorBase],tags=["Administradores"])
async def get_telefonos_admins(db: Session = Depends(get_db)):
    """Obtiene todos los teléfonos de administradores"""
    return db.query(models.Telefonos_Administrador).all()

@app.get("/telefonosadmin/{id_admin}", response_model=List[TelefonosAdministradorBase],tags=["Administradores"])
async def get_telefonos_admin(id_admin: str, db: Session = Depends(get_db)):
    """Obtiene los teléfonos de un administrador específico"""
    db_telefonos = db.query(models.Telefonos_Administrador).filter(models.Telefonos_Administrador.cedula_admin == id_admin).all()
    if not db_telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teléfonos no encontrados")
    return db_telefonos

@app.get("/direccionadmin/", response_model=List[DireccionesAdministradorBase],tags=["Administradores"])
async def get_direcciones_admins(db: Session = Depends(get_db)):
    """Obtiene todas las direcciones de administradores"""
    return db.query(models.Direccion_Administrador).all()

@app.get("/direccionadmin/{id_admin}", response_model=DireccionesAdministradorBase,tags=["Administradores"])
async def get_direccion_admin(id_admin: str, db: Session = Depends(get_db)):
    """Obtiene la dirección de un administrador específico"""
    db_direccion = db.query(models.Direccion_Administrador).filter(models.Direccion_Administrador.id_admin == id_admin).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")
    return db_direccion



@app.get("/telefonosafiliado/{id_afiliado}", response_model=List[TelefonosComercioAfiliadoBase], tags=["Comercios Afiliados"])
async def get_telefonos_afiliado(id_afiliado: str, db: Session = Depends(get_db)):
    """Obtiene los teléfonos de un comercio afiliado específico"""
    db_telefonos = db.query(models.Telefono_Comercio).filter(
        models.Telefono_Comercio.cedula_comercio == id_afiliado
    ).all()

    if not db_telefonos:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No se encontraron teléfonos para este comercio afiliado"
        )

    # Convertir los resultados al formato esperado
    return [
        TelefonosComercioAfiliadoBase(
            telefono=telefono.telefono,
            cedula_comercio=telefono.cedula_comercio
        ) for telefono in db_telefonos
    ]

# UPDATE - Administrador
@app.put("/admin/{id_admin}", response_model=AdministradorBase,tags=["Administradores"])
async def update_admin(id_admin: str, admin: AdministradorBase, db: Session = Depends(get_db)):
    """Actualiza los datos de un administrador"""
    db_admin = db.query(models.Administrador).filter(models.Administrador.cedula == id_admin).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador no encontrado")

    for key, value in admin.dict().items():
        setattr(db_admin, key, value)

    db.commit()
    db.refresh(db_admin)
    return db_admin

@app.put("/direccionadmin/{id_admin}", response_model=DireccionesAdministradorBase,tags=["Administradores"])
async def update_direccion(id_admin: str, direccion: DireccionesAdministradorBase, db: Session = Depends(get_db)):
    """Actualiza la dirección de un administrador"""
    db_direccion = db.query(models.Direccion_Administrador).filter(models.Direccion_Administrador.id_admin == id_admin).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")

    db_direccion.provincia = direccion.provincia
    db_direccion.canton = direccion.canton
    db_direccion.distrito = direccion.distrito

    db.commit()
    db.refresh(db_direccion)
    return db_direccion

@app.put("/telefonosadmin/{id_admin}", response_model=List[TelefonosAdministradorBase],tags=["Administradores"])
async def update_telefono(id_admin: str, telefonos: List[TelefonosAdministradorBase], db: Session = Depends(get_db)):
    """Actualiza los teléfonos de un administrador"""
    db_telefonos = db.query(models.Telefonos_Administrador).filter(models.Telefonos_Administrador.cedula_admin == id_admin).all()
    if not db_telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Teléfonos no encontrados")

    nuevos_telefonos = {telefono.telefono for telefono in telefonos}

    # Eliminar teléfonos que ya no están en la lista
    if len(telefonos) < len(db_telefonos):
        for db_telefono in db_telefonos:
            if db_telefono.telefono not in nuevos_telefonos:
                db.delete(db_telefono)

    # Actualizar o agregar nuevos teléfonos
    telefonos_actualizados = []
    for telefono in telefonos:
        db_telefono = next((t for t in db_telefonos if t.telefono == telefono.telefono), None)
        if db_telefono:
            telefonos_actualizados.append(db_telefono)
        else:
            new_telefono = models.Telefonos_Administrador(
                cedula_admin=id_admin,
                telefono=telefono.telefono
            )
            db.add(new_telefono)
            telefonos_actualizados.append(new_telefono)

    db.commit()
    for telefono in telefonos_actualizados:
        db.refresh(telefono)

    return telefonos_actualizados

# DELETE - Administrador
@app.delete("/admin/{id_admin}", status_code=status.HTTP_204_NO_CONTENT,tags=["Administradores"])
async def delete_admin(id_admin: str, db: Session = Depends(get_db)):
    """Elimina un administrador"""
    db_admin = db.query(models.Administrador).filter(models.Administrador.cedula == id_admin).first()
    if db_admin is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Administrador no encontrado")

    db.delete(db_admin)
    db.commit()
    return {"detail": "Administrador eliminado exitosamente"}

@app.delete("/direccionadmin/{id_admin}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_direcciones_admin(id_admin: str, db: Session = Depends(get_db)):
    """Elimina las direcciones de un administrador"""
    direcciones = db.query(models.Direccion_Administrador).filter(models.Direccion_Administrador.id_admin == id_admin).all()
    if not direcciones:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron direcciones para el administrador")

    for direccion in direcciones:
        db.delete(direccion)

    db.commit()
    return {"detail": "Todas las direcciones del administrador han sido eliminadas exitosamente"}

@app.delete("/telefonosadmin/{id_admin}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_telefonos_admin(id_admin: str, db: Session = Depends(get_db)):
    """Elimina los teléfonos de un administrador"""
    telefonos = db.query(models.Telefonos_Administrador).filter(models.Telefonos_Administrador.cedula_admin == id_admin).all()
    if not telefonos:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron teléfonos para el administrador")

    for telefono in telefonos:
        db.delete(telefono)

    db.commit()
    return {"detail": "Todos los teléfonos del administrador han sido eliminados exitosamente"}

################################
# Endpoints para Afiliados     #
################################

# CREATE - Afiliados
@app.post("/afiliados/", status_code=status.HTTP_201_CREATED,tags=["Comercios Afiliados"])
async def create_afiliados(afiliado: ComercioAfiliadoBase, db: Session = Depends(get_db)):
    """Crea un nuevo comercio afiliado"""
    new_afiliado = models.Comercio_afiliado(
        cedula_juridica=afiliado.cedula_juridica,
        nombre=afiliado.nombre,
        correo=afiliado.correo,
        SINPE=afiliado.SINPE,
        id_tipo=afiliado.id_tipo,
        cedula_admin=afiliado.cedula_admin
    )
    db.add(new_afiliado)
    try:
        db.commit()
        db.refresh(new_afiliado)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Error al crear el comercio afiliado"
        )
    return new_afiliado


@app.post("/direccionafiliado/", status_code=status.HTTP_201_CREATED,tags=["Comercios Afiliados"])
async def create_direccion_afiliado(direccion: DireccionesComercioBase, db: Session = Depends(get_db)):
    """Crea una nueva dirección para un comercio afiliado"""
    new_direccion = models.Direccion_Comercio(
        id_comercio=direccion.id_comercio,
        provincia=direccion.provincia,
        canton=direccion.canton,
        distrito=direccion.distrito
    )
    db.add(new_direccion)
    try:
        db.commit()
        db.refresh(new_direccion)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear la dirección")
    return new_direccion

from typing import List

@app.post("/telefonosafiliado/", status_code=status.HTTP_201_CREATED,tags=["Comercios Afiliados"])
async def create_telefono_afiliado(telefonos: List[TelefonosComercioAfiliadoBase], db: Session = Depends(get_db)):
    """Crea nuevos teléfonos para un comercio afiliado"""
    created_telefonos = []

    try:
        for telefono_data in telefonos:
            new_telefono = models.Telefono_Comercio(
                cedula_comercio=telefono_data.cedula_comercio,
                telefono=telefono_data.telefono
            )
            db.add(new_telefono)
            created_telefonos.append(new_telefono)

        db.commit()
        for telefono in created_telefonos:
            db.refresh(telefono)

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al crear los teléfonos: {str(e)}"
        )

    return created_telefonos

# READ - Afiliados



@app.get("/afiliados/", response_model=List[ComercioAfiliadoBase],tags=["Comercios Afiliados"])
async def get_afiliados(db: Session = Depends(get_db)):
    """Obtiene todos los comercios afiliados"""
    return db.query(models.Comercio_afiliado).all()

@app.get("/afiliados/{id_afiliado}", response_model=ComercioAfiliadoBase,tags=["Comercios Afiliados"])
async def get_one_afiliado(id_afiliado: str, db: Session = Depends(get_db)):
    # Consulta para obtener un comercio afiliado específico según la cédula
    db_afiliado = db.query(models.Comercio_afiliado).filter(models.Comercio_afiliado.cedula_juridica == id_afiliado).first()
    if db_afiliado is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comercio afiliado no encontrado")
    return db_afiliado



@app.get("/direccionafiliado/", response_model=List[DireccionesComercioBase],tags=["Comercios Afiliados"])
async def get_administradores(db: Session = Depends(get_db)):
     # Consulta para obtener todas las direcciones de AFILIADO de la base de datos
     direccionesafiliado = db.query(models.Direccion_Comercio).all()
     return direccionesafiliado


@app.get("/telefonosafiliado/", response_model=List[TelefonosComercioAfiliadoBase],tags=["Comercios Afiliados"])
async def get_telefonos_comercio(db: Session = Depends(get_db)):
    # Consulta para obtener todos los tipos de comercio
    telefonos_comercio = db.query(models.Telefono_Comercio).all()

    return telefonos_comercio



@app.get("/direccionafiliado/{id_afiliado}", response_model=DireccionesComercioBase, tags=["Comercios Afiliados"])
async def get_direccion_afiliado(id_afiliado: str, db: Session = Depends(get_db)):
    """Obtiene la dirección de un comercio afiliado específico"""
    db_direccion = db.query(models.Direccion_Comercio).filter(models.Direccion_Comercio.id_comercio == id_afiliado).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")
    return db_direccion



# UPDATE - Afiliados

@app.put("/afiliados/{id_afiliado}", response_model=ComercioAfiliadoBase,tags=["Comercios Afiliados"])
async def update_afiliado(id_afiliado: str, afiliado: ComercioAfiliadoBase, db: Session = Depends(get_db)):
    db_afiliado = db.query(models.Comercio_afiliado).filter(models.Comercio_afiliado.cedula_juridica == id_afiliado).first()
    if db_afiliado is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comercio afiliado no encontrado")

    db_afiliado.nombre = afiliado.nombre
    db_afiliado.correo = afiliado.correo
    db_afiliado.SINPE = afiliado.SINPE
    db_afiliado.id_tipo = afiliado.id_tipo
    db_afiliado.cedula_admin = afiliado.cedula_admin

    db.commit()
    db.refresh(db_afiliado)
    return db_afiliado


@app.put("/direccionafiliado/{id_afiliado}", response_model=DireccionesComercioBase,tags=["Comercios Afiliados"])
async def update_direccion_afiliado(id_afiliado: str, direccion: DireccionesComercioBase, db: Session = Depends(get_db)):
    db_direccion = db.query(models.Direccion_Comercio).filter(models.Direccion_Comercio.id_comercio == id_afiliado).first()
    if db_direccion is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Dirección no encontrada")

    db_direccion.provincia = direccion.provincia
    db_direccion.canton = direccion.canton
    db_direccion.distrito = direccion.distrito

    db.commit()
    db.refresh(db_direccion)
    return db_direccion


@app.put("/telefonosafiliado/{id_afiliado}", response_model=List[TelefonosComercioAfiliadoBase], tags=["Comercios Afiliados"])
async def update_telefono_afiliado(id_afiliado: str, telefonos: List[dict], db: Session = Depends(get_db)):
    """
    Actualiza los teléfonos de un comercio afiliado.
    - Si hay menos teléfonos en la lista nueva: elimina los que no están y actualiza los existentes
    - Si hay igual cantidad: actualiza los valores
    - Si hay más teléfonos: actualiza los existentes y agrega los nuevos
    """
    # Validar que el comercio afiliado existe
    db_afiliado = db.query(models.Comercio_afiliado).filter(
        models.Comercio_afiliado.cedula_juridica == id_afiliado
    ).first()
    if not db_afiliado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comercio afiliado no encontrado"
        )

    # Obtener teléfonos actuales de la base de datos
    db_telefonos = db.query(models.Telefono_Comercio).filter(
        models.Telefono_Comercio.cedula_comercio == id_afiliado
    ).all()

    # Validar y procesar los nuevos teléfonos
    nuevos_telefonos_list = []
    for tel in telefonos:
        if not isinstance(tel, dict) or 'telefono' not in tel:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Formato inválido. Cada teléfono debe tener el campo 'telefono'"
            )
        nuevos_telefonos_list.append(tel['telefono'])

    # Crear conjuntos para comparación
    telefonos_actuales = {t.telefono for t in db_telefonos}
    telefonos_nuevos = set(nuevos_telefonos_list)

    try:
        # Caso 1: Menos teléfonos - Eliminar los que no están en la nueva lista
        telefonos_a_eliminar = telefonos_actuales - telefonos_nuevos
        if telefonos_a_eliminar:
            for telefono in db_telefonos:
                if telefono.telefono in telefonos_a_eliminar:
                    db.delete(telefono)

        # Actualizar teléfonos existentes y agregar nuevos
        telefonos_actualizados = []
        for nuevo_telefono in nuevos_telefonos_list:
            # Buscar si el teléfono ya existe
            telefono_existente = next(
                (t for t in db_telefonos if t.telefono == nuevo_telefono),
                None
            )

            if telefono_existente:
                # Actualizar teléfono existente si es necesario
                telefono_existente.telefono = nuevo_telefono
                telefonos_actualizados.append(telefono_existente)
            else:
                # Agregar nuevo teléfono
                nuevo_registro = models.Telefono_Comercio(
                    cedula_comercio=id_afiliado,
                    telefono=nuevo_telefono
                )
                db.add(nuevo_registro)
                telefonos_actualizados.append(nuevo_registro)

        # Commit de los cambios
        db.commit()

        # Refrescar todos los registros
        for telefono in telefonos_actualizados:
            db.refresh(telefono)

        # Obtener la lista actualizada de teléfonos
        telefonos_finales = db.query(models.Telefono_Comercio).filter(
            models.Telefono_Comercio.cedula_comercio == id_afiliado
        ).all()

        # Convertir a formato de respuesta
        return [
            TelefonosComercioAfiliadoBase(
                telefono=t.telefono,
                cedula_comercio=t.cedula_comercio
            ) for t in telefonos_finales
        ]

    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Error al actualizar teléfonos: {str(e)}"
        )

# DELETE - Afiliados
@app.delete("/afiliados/{cedula_juridica}", status_code=status.HTTP_204_NO_CONTENT,tags=["Comercios Afiliados"])
async def delete_afiliado(cedula_juridica: str, db: Session = Depends(get_db)):
    """Elimina un comercio afiliado"""
    db_afiliado = db.query(models.Comercio_afiliado).filter(
        models.Comercio_afiliado.cedula_juridica == cedula_juridica
    ).first()
    if db_afiliado is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Comercio afiliado no encontrado"
        )

    db.delete(db_afiliado)
    db.commit()
    return {"detail": "Comercio afiliado eliminado exitosamente"}

@app.delete("/direccionafiliado/{id_afiliado}", status_code=status.HTTP_204_NO_CONTENT,tags=["Comercios Afiliados"])
async def delete_direcciones_afiliado(id_afiliado: str, db: Session = Depends(get_db)):
    # Buscar todas las direcciones asociadas al comercio afiliado
    direcciones = db.query(models.Direccion_Comercio).filter(models.Direccion_Comercio.id_comercio == id_afiliado).all()

    if not direcciones:
        # Lanzar una excepción si no se encuentran direcciones
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron direcciones para el comercio afiliado")

    # Eliminar todas las direcciones encontradas
    for direccion in direcciones:
        db.delete(direccion)

    db.commit()  # Confirmar los cambios
    return {"detail": "Todas las direcciones del comercio afiliado han sido eliminadas exitosamente"}


@app.delete("/telefonosafiliado/{id_afiliado}", status_code=status.HTTP_204_NO_CONTENT,tags=["Comercios Afiliados"])
async def delete_telefonos_afiliado(id_afiliado: str, db: Session = Depends(get_db)):
    # Buscar todos los teléfonos asociados al comercio afiliado
    telefonos = db.query(models.Telefono_Comercio).filter(models.Telefono_Comercio.cedula_comercio == id_afiliado).all()

    if not telefonos:
        # Lanzar una excepción si no se encuentran teléfonos
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No se encontraron teléfonos para el comercio afiliado")

    # Eliminar todos los teléfonos encontrados
    for telefono in telefonos:
        db.delete(telefono)

    db.commit()  # Confirmar los cambios
    return {"detail": "Todos los teléfonos del comercio afiliado han sido eliminados exitosamente"}



#Tipos de Comercio

# Endpoints para Tipos de Comercio

# CREATE - Tipo de Comercio
@app.post("/tiposcomercio/", response_model=TipoComercioBase, status_code=status.HTTP_201_CREATED, tags=["Tipos de Comercio"])
async def create_tipo_comercio(tipo_comercio: TipoComercioBase, db: Session = Depends(get_db)):
    """
    Crea un nuevo tipo de comercio.
    """
    new_tipo_comercio = models.Tipo_Comercio(
        nombre=tipo_comercio.nombre
    )
    db.add(new_tipo_comercio)
    try:
        db.commit()
        db.refresh(new_tipo_comercio)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Error al crear el tipo de comercio")
    return new_tipo_comercio

# READ - Tipos de Comercio
@app.get("/tiposcomercio/", response_model=List[TipoComercioBase], tags=["Tipos de Comercio"])
async def get_tipos_comercio(db: Session = Depends(get_db)):
    """
    Obtiene todos los tipos de comercio.
    """
    tipos_comercio = db.query(models.Tipo_Comercio).all()
    return tipos_comercio

# GET - Tipo de Comercio por ID
@app.get("/tiposcomercio/{id_tipo}", response_model=TipoComercioBase, tags=["Tipos de Comercio"])
async def get_tipo_comercio(id_tipo: int, db: Session = Depends(get_db)):
    """
    Obtiene un tipo de comercio específico por su ID.
    """
    db_tipo_comercio = db.query(models.Tipo_Comercio).filter(models.Tipo_Comercio.ID == id_tipo).first()
    if db_tipo_comercio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tipo de comercio no encontrado")
    return db_tipo_comercio

# UPDATE - Tipo de Comercio
@app.put("/tiposcomercio/{id_tipo}", response_model=TipoComercioBase, tags=["Tipos de Comercio"])
async def update_tipo_comercio(id_tipo: int, tipo_comercio: TipoComercioBase, db: Session = Depends(get_db)):
    """
    Actualiza un tipo de comercio.
    """
    db_tipo_comercio = db.query(models.Tipo_Comercio).filter(models.Tipo_Comercio.ID == id_tipo).first()
    if db_tipo_comercio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tipo de comercio no encontrado")

    db_tipo_comercio.nombre = tipo_comercio.nombre
    db.commit()
    db.refresh(db_tipo_comercio)
    return db_tipo_comercio

# DELETE - Tipo de Comercio
@app.delete("/tiposcomercio/{id_tipo}", status_code=status.HTTP_204_NO_CONTENT, tags=["Tipos de Comercio"])
async def delete_tipo_comercio(id_tipo: int, db: Session = Depends(get_db)):
    """
    Elimina un tipo de comercio.
    """
    db_tipo_comercio = db.query(models.Tipo_Comercio).filter(models.Tipo_Comercio.ID == id_tipo).first()
    if db_tipo_comercio is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Tipo de comercio no encontrado")

    db.delete(db_tipo_comercio)
    db.commit()
    return {"detail": "Tipo de comercio eliminado exitosamente"}


#Para repartidores



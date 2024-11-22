from sqlalchemy import Column, String, Integer, Numeric, ForeignKey, Text
from database import Base


# Modelos
class Administrador(Base):
    __tablename__ = 'administrador'
    cedula = Column(String(20), primary_key=True)
    usuario = Column(String(50), unique=True, nullable=False)
    password = Column(String(100), nullable=False)
    nombre = Column(String(100), nullable=False)
    apellido1 = Column(String(100), nullable=False)
    apellido2 = Column(String(100),nullable=False)


class Direccion_Administrador(Base):
    __tablename__ = 'direccionesadministrador'
    id = Column(Integer, primary_key=True , autoincrement=True)  # Agrega un ID como clave primaria
    provincia = Column(String(100), nullable=False)
    canton = Column(String(100), nullable=False)
    distrito = Column(String(100), nullable=False)
    id_admin = Column(String(20), ForeignKey('administrador.cedula'), nullable=False)

class Telefonos_Administrador(Base):
    __tablename__ = 'telefonosadministrador'
    id = Column(Integer, primary_key=True , autoincrement=True)  # Agrega un ID como clave primaria
    telefono = Column(String(50), unique=True, nullable=False)
    cedula_admin = Column(String(20), ForeignKey('administrador.cedula'), nullable=False)


### COMERCIOS INICIALIZACIÓN

class Comercio_afiliado(Base):
    __tablename__ = 'comercio'
    cedula_juridica = Column(String(20), primary_key=True)
    nombre = Column(String(100), nullable=False)
    correo = Column(String(100), nullable=False)
    SINPE = Column(String(50),nullable=False)
    id_tipo = Column(Integer, ForeignKey('tipo_comercio.ID'), nullable=False)
    cedula_admin = Column(String(20), ForeignKey('administrador.cedula'), nullable=False)


class Direccion_Comercio(Base):
    __tablename__ = 'direccionescomercioafiliado'
    id = Column(Integer, primary_key=True , autoincrement=True)  # Agrega un ID como clave primaria
    provincia = Column(String(100), nullable=False)
    canton = Column(String(100), nullable=False)
    distrito = Column(String(100), nullable=False)
    id_comercio = Column(String(20), ForeignKey('comercio.cedula_juridica'), nullable=False)

class Tipo_Comercio(Base):
    __tablename__ = 'tipo_comercio'
    ID = Column(Integer, primary_key=True, autoincrement=True)
    nombre = Column(String(100), nullable=False)



class Telefono_Comercio(Base):
    __tablename__ = 'telefonocomercioafiliado'
    id = Column(Integer, primary_key=True , autoincrement=True)  # Agrega un ID como clave primaria
    telefono = Column(String(50), unique=True, nullable=False)
    cedula_comercio = Column(String(20), ForeignKey('comercio.cedula_juridica'), nullable=False)


#REPARTIDORES

class Repartidor(Base):
    __tablename__ = 'repartidores'

    id = Column(Integer, primary_key=True)
    usuario = Column(String(50), nullable=False,unique=True)
    nombre = Column(String(100), nullable=False)
    apellido1 = Column(String(100), nullable=False)
    apellido2 = Column(String(100), nullable=False)
    correo = Column(String(100), nullable=False)

class DireccionRepartidor(Base):
    __tablename__ = 'direccion_repartidores'

    id = Column(Integer, primary_key=True, autoincrement=True)
    id_repartidor = Column(Integer, ForeignKey('repartidores.id'), nullable=False)
    provincia = Column(String(100), nullable=False)
    canton = Column(String(100), nullable=False)
    distrito = Column(String(100), nullable=False)

class TelefonoRepartidor(Base):
    __tablename__ = 'telefono_repartidores'

    id = Column(Integer, primary_key=True, autoincrement=True)
    cedula_repartidor = Column(String(20), ForeignKey('repartidores.id'), nullable=False)
    telefono = Column(String(50), nullable=False)

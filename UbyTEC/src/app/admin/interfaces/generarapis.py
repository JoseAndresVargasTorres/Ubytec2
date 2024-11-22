import random
import string
import json
from typing import List

def generar_cedula() -> int:
    return random.randint(100000000, 999999999)

def generar_nombre() -> str:
    nombres = [
        "Juan", "María", "Carlos", "Ana", "José", "Laura", "Pedro", "Isabel",
        "Miguel", "Sofía", "Luis", "Carmen", "Diego", "Patricia", "Gabriel"
    ]
    return random.choice(nombres)

def generar_apellido() -> str:
    apellidos = [
        "García", "Rodríguez", "González", "Fernández", "López", "Martínez",
        "Sánchez", "Pérez", "Gómez", "Martín", "Jiménez", "Ruiz", "Hernández"
    ]
    return random.choice(apellidos)

def generar_usuario(nombre: str, apellido: str) -> str:
    usuario = (nombre[:3] + apellido[:3]).lower()
    numeros = ''.join(random.choices(string.digits, k=3))
    return f"{usuario}{numeros}"

def generar_password() -> str:
    longitud = random.randint(8, 12)
    caracteres = string.ascii_letters + string.digits + "!@#$%^&*"
    return ''.join(random.choices(caracteres, k=longitud))

def generar_correo(nombre: str, apellido: str) -> str:
    dominios = ["gmail.com", "hotmail.com", "yahoo.com", "outlook.com"]
    nombre_usuario = f"{nombre.lower()}.{apellido.lower()}"
    numeros = ''.join(random.choices(string.digits, k=2))
    dominio = random.choice(dominios)
    return f"{nombre_usuario}{numeros}@{dominio}"

def generar_usuario_random() -> str:
    nombre = generar_nombre()
    apellido1 = generar_apellido()
    apellido2 = generar_apellido()

    usuario = {
        "cedula": generar_cedula(),
        "usuario": generar_usuario(nombre, apellido1),
        "password": generar_password(),
        "nombre": nombre,
        "apellido1": apellido1,
        "apellido2": apellido2,
        "correo": generar_correo(nombre, apellido1)
    }

    # Convertir a JSON con formato específico
    return json.dumps(usuario, indent=2)

# Generar y mostrar el usuario en el formato solicitado
print(generar_usuario_random())

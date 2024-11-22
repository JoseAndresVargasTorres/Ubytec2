import os

def crear_interfaz():
    # Obtener el directorio donde está el script
    directorio_actual = os.path.dirname(os.path.abspath(__file__))

    # Solicitar el nombre de la interfaz
    nombre_interfaz = input("Ingresa el nombre de la interfaz (ej: Admin): ").strip()
    nombre_archivo = os.path.join(directorio_actual, f"{nombre_interfaz}.ts")

    # Verificar si el archivo ya existe
    if os.path.exists(nombre_archivo):
        print(f"El archivo '{nombre_archivo}' ya existe. Elige otro nombre o borra el archivo existente.")
        return

    # Definir los tipos disponibles
    tipos_dato = {
        "1": "string",
        "2": "number",
        "3": "boolean",
        "4": "any",
        "5": "Date",
        "6": "Array<string>",
        "7": "Array<number>",
        "8": "Array<boolean>",
        # Agrega más tipos si lo deseas
    }

    # Crear una lista para almacenar los atributos
    atributos = []

    # Solicitar los atributos
    while True:
        atributo = input("Ingresa el nombre del atributo (o escribe 'listo' para finalizar): ").strip()
        if atributo.lower() == 'listo':
            break

        # Mostrar las opciones de tipo de dato
        print("Selecciona el tipo de dato para el atributo:")
        for clave, valor in tipos_dato.items():
            print(f"{clave}: {valor}")

        # Elegir el tipo de dato basado en el número
        tipo_seleccionado = input("Ingresa el número correspondiente al tipo de dato: ").strip()
        tipo = tipos_dato.get(tipo_seleccionado)

        if tipo is None:
            print("Selección inválida. Inténtalo nuevamente.")
        else:
            atributos.append((atributo, tipo))

    # Crear el contenido de la interfaz
    contenido = f"export interface {nombre_interfaz} {{\n"
    for atributo, tipo in atributos:
        contenido += f"  {atributo}: {tipo};\n"
    contenido += "}\n"

    # Escribir el contenido en el archivo
    with open(nombre_archivo, 'w') as file:
        file.write(contenido)

    print(f"Interfaz '{nombre_interfaz}' creada exitosamente en el archivo '{nombre_archivo}'.")

if __name__ == "__main__":
    crear_interfaz()

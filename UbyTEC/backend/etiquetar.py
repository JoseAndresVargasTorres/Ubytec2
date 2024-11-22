import re
import os
import sys

def add_endpoint_metadata(input_file):
    # Asegurarse de que la ruta incluya el directorio backend
    if not input_file.startswith('backend/'):
        input_file = os.path.join('backend', input_file)

    # Verificar si el archivo existe
    if not os.path.exists(input_file):
        print(f"Error: No se encontró el archivo '{input_file}'")
        print(f"Directorio actual: {os.getcwd()}")
        print("\nContenido del directorio 'backend':")
        try:
            for file in os.listdir('backend'):
                print(f"- {file}")
        except FileNotFoundError:
            print("No se encontró el directorio 'backend'")
            print("\nDirectorios disponibles:")
            for item in os.listdir():
                if os.path.isdir(item):
                    print(f"- {item}")
        return

    # Leer el archivo original
    try:
        with open(input_file, 'r', encoding='utf-8') as file:
            content = file.read()
    except Exception as e:
        print(f"Error al leer el archivo: {str(e)}")
        return

    # Patrones para identificar endpoints
    endpoint_pattern = r'@app\.(get|post|put|delete)\([^)]+\)\s+async def ([^(]+)\('

    # Diccionario para mapear rutas a categorías
    route_categories = {
        'admin': 'Administradores',
        'direccionadmin': 'Administradores',
        'telefonosadmin': 'Administradores',
        'afiliados': 'Comercios Afiliados',
        'direccionafiliado': 'Comercios Afiliados',
        'telefonosafiliado': 'Comercios Afiliados',
        'tiposcomercio': 'Tipos de Comercio'
    }

    # Diccionario para mapear métodos HTTP a descripciones
    method_descriptions = {
        'get': 'Obtener',
        'post': 'Crear',
        'put': 'Actualizar',
        'delete': 'Eliminar'
    }

    def get_category(route):
        for key, value in route_categories.items():
            if key in route:
                return value
        return 'Otros'

    def create_summary(method, route, func_name):
        action = method_descriptions.get(method.lower(), method)
        if '{' in route:  # Es un endpoint con parámetro
            return f"{action} {route.split('/')[-2]} específico"
        return f"{action} {route.split('/')[-1]}"

    # Buscar y reemplazar decoradores
    modified_content = content

    # Encontrar todos los endpoints
    endpoints = re.finditer(endpoint_pattern, content, re.MULTILINE)

    for match in endpoints:
        original_decorator = match.group(0)
        method = match.group(1).lower()
        route = original_decorator.split('"')[1] if '"' in original_decorator else original_decorator.split("'")[1]

        # Determinar la categoría basada en la ruta
        category = get_category(route)

        # Crear el nuevo decorador con metadata
        new_decorator = f'''@app.{method}("{route}",
          tags=["{category}"],
          summary="{create_summary(method, route, match.group(2))}",
          response_description="Operación exitosa"'''

        # Agregar response_model si es un GET
        if method == 'get':
            if 'List[' in original_decorator:
                new_decorator += ',\n          response_model=List'

        # Agregar status_code para POST
        if method == 'post':
            new_decorator += ',\n          status_code=status.HTTP_201_CREATED'

        # Agregar status_code para DELETE
        if method == 'delete':
            new_decorator += ',\n          status_code=status.HTTP_204_NO_CONTENT'

        new_decorator += ')'

        # Reemplazar el decorador original
        modified_content = modified_content.replace(original_decorator, new_decorator)

    # Crear nombre del archivo de salida en el mismo directorio que el archivo original
    output_file = os.path.splitext(input_file)[0] + '_tagged.py'

    # Guardar el archivo modificado
    try:
        with open(output_file, 'w', encoding='utf-8') as file:
            file.write(modified_content)
        print(f"Archivo procesado exitosamente. Se ha creado '{output_file}' con los endpoints etiquetados.")
    except Exception as e:
        print(f"Error al guardar el archivo: {str(e)}")

if __name__ == "__main__":
    # Si se proporciona un nombre de archivo como argumento, úsalo
    if len(sys.argv) > 1:
        input_file = sys.argv[1]
    else:
        # Si no, pedir al usuario el nombre del archivo
        input_file = input("Ingrese el nombre del archivo a procesar (sin incluir 'backend/'): ")

    add_endpoint_metadata(input_file)

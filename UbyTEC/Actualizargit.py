import subprocess

def git_pull():
    """Ejecuta git pull para actualizar el repositorio."""
    try:
        result = subprocess.run(["git", "pull"], check=True, text=True, capture_output=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error ejecutando git pull: {e.stderr}")

def git_list_remote_branches():
    """Muestra las ramas remotas disponibles y permite elegir una."""
    try:
        # Mostrar todas las ramas remotas
        result = subprocess.run(["git", "branch", "-r"], check=True, text=True, capture_output=True)
        branches = result.stdout.splitlines()
        print("Ramas remotas disponibles:")
        for idx, branch in enumerate(branches):
            print(f"{idx + 1}. {branch.strip()}")

        # Seleccionar la rama remota
        choice = int(input("Selecciona el número de la rama remota a la que deseas acceder: ")) - 1
        branch_to_switch = branches[choice].strip().replace('origin/', '')

        # Cambiar a la rama remota seleccionada
        subprocess.run(["git", "checkout", "-t", f"origin/{branch_to_switch}"], check=True, text=True)
        print(f"Cambiado a la rama remota: origin/{branch_to_switch}")
    except subprocess.CalledProcessError as e:
        print(f"Error ejecutando git branch o git checkout: {e.stderr}")
    except (ValueError, IndexError):
        print("Selección no válida.")

def git_commit_and_push():
    """Añade archivos, realiza commit y empuja cambios a la rama actual."""
    try:
        # git add .
        subprocess.run(["git", "add", "."], check=True, text=True)
        commit_message = input("Introduce el mensaje del commit: ")

        # git commit
        subprocess.run(["git", "commit", "-m", commit_message], check=True, text=True)

        # git push
        result = subprocess.run(["git", "push"], check=True, text=True, capture_output=True)
        print(result.stdout)
    except subprocess.CalledProcessError as e:
        print(f"Error durante git add, commit o push: {e.stderr}")

def main():
    """Menú principal para seleccionar una acción."""
    while True:
        print("\nOpciones de Git:")
        print("1. Hacer git pull")
        print("2. Ver ramas remotas disponibles y cambiar de rama")
        print("3. Hacer git add, commit y push")
        print("4. Salir")

        choice = input("Elige una opción (1-4): ")

        if choice == '1':
            git_pull()
        elif choice == '2':
            git_list_remote_branches()
        elif choice == '3':
            git_commit_and_push()
        elif choice == '4':
            print("Saliendo...")
            break
        else:
            print("Opción no válida. Intenta de nuevo.")

if __name__ == "__main__":
    main()

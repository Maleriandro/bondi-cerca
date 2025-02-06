import csv
import os

stops = set()

archivo_paradas = "./gtfs/stops.txt"
archivo_recorridos = "./gtfs/shapes.txt"
archivo_recorridos_y_paradas = "./gtfs/shapes_with_stops.txt"

if (not os.path.exists(archivo_paradas) or not os.path.exists(archivo_recorridos)):
    print("No se encuentra archivo csv de recorridos y paradas.")
    print("Por favor, asegurese de que los archivos stops.txt y shapes.txt se encuentren en la carpeta gtfs.")
    print("Si no tiene los archivos, puede descargarlos de https://data.buenosaires.gob.ar/dataset/colectivos-gtfs")
    exit()

with open(archivo_paradas, 'r', encoding="utf-8") as file:
    csvreader = csv.reader(file)
    next(csvreader)
    
    for _, _, _, y, x in csvreader:
        stops.add((x,y))
        


with open(archivo_recorridos, 'r', encoding="utf-8") as file:
    csvreader = csv.reader(file)
    next(csvreader)
    
    with open(archivo_recorridos_y_paradas, "w", encoding="utf-8", newline='') as new_file:
        csvwriter = csv.writer(new_file)
        csvwriter.writerow(("id", "lat", "lon", "id_tramo", "es_parada"))        
        for id, y, x, id_tramo, *_ in csvreader:            
            es_parada = (x,y) in stops
            
            csvwriter.writerow((id, y, x, id_tramo, es_parada))

    
    

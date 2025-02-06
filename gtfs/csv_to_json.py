import csv
import json
import random

import os

random.seed(1)
 
def append_to_list_in(list, i, value):
    length = len(list)
    
    for j in range(i-length+1):
        list.append(None)
        
    list[i] = value
    
# Function to convert a CSV to JSON
# Takes the file paths as arguments
def make_json(csvFilePath, jsonFilePath, solo_paradas=False):
     
    # create a dictionary
    data = {}
    
    offsets = {}
     
    # Open a csv reader called DictReader
    with open(csvFilePath, 'r', ) as file:
        csvreader = csv.reader(file)
        next(csvreader)
    
    
        for id, xcoord, ycoord, id_tramo, es_parada in csvreader:
            if (solo_paradas and es_parada == 'False'):
                continue
            
            id_tramo = int(id_tramo)-1
            coord = [float(xcoord), float(ycoord)]
            
            # Para ponerle offset de posicion a las paradas (para que no se superpongan?)
            value_offset=0
            
            if id not in data:
                data[id] = []
                offsets[id] = [random.uniform(-value_offset, value_offset),random.uniform(-value_offset, value_offset)]
            
            coord = list(map(sum, zip(coord,offsets[id])))
            
            append_to_list_in(data[id], id_tramo, coord)
    
    mostrar = True
    
    for key, array_valores in data.items():
        
        data[key] = list(filter(None, array_valores))
             

    json_string = json.dumps(data)
    
    with open(jsonFilePath, "w") as file:
        file.write(json_string)
        
        

        
         
# Driver Code
 
# Decide the two file paths according to your 
# computer system
csvFilePath = r'./gtfs/shapes_with_stops.txt'
jsonFilePath = r'./gtfs/recorridos.json'
jsonParadasPath = r'./gtfs/paradas.json'
 
 
# throw error if csvfilepath doesnt exist
if (not os.path.exists(csvFilePath)):
    print("No se encuentra archivo csv de recorridos y paradas.")
    print("Probablemente deba ejecutar primero el archivo 'format.py'")
    exit()


 
 
# Call the make_json function
make_json(csvFilePath, jsonFilePath)
make_json(csvFilePath, jsonParadasPath, solo_paradas=True)


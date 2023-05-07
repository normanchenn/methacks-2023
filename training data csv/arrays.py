column1 = []
column2 = []

with open('/Users/normanchen/Desktop/airports.csv', 'r') as file:
    for line in file:
        line = line.strip()  # Remove newline character
        values = line.split(',')  # Split line by comma
        column1.append(values[0])
        column2.append(values[1])
print(column1)
print(column2)

import pymongo

# Replace the placeholder with your connection string
client = pymongo.MongoClient("mongodb+srv://myusername:mypassword@mycluster.mongodb.net")

# Replace mydatabase and mycollection with your database and collection names
db = client["mydatabase"]
collection = db["mycollection"]

# Example data to insert
airport_names = ["John F. Kennedy International Airport", "Los Angeles International Airport"]
airport_codes = ["JFK", "LAX"]

# Create a list of documents to insert
documents = [{"name": name, "code": code} for name, code in zip(airport_names, airport_codes)]

# Insert the documents into the collection
collection.insert_many(documents)

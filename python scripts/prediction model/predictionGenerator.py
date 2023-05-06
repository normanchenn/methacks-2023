def process_attractions(file_path):
    with open(file_path, 'r') as file:
        attractions = file.read().splitlines()

    countries = []
    attractions_list = []

    for line in attractions:
        if line.strip() == '':
            continue
        elif line[0].isdigit():
            attractions_list.append(line[line.index('.')+2:])
        else:
            countries.append(line.strip())

    result = "const seasonTest = [\n"

    for attraction in attractions_list:
        result += f"\t\"{attraction}\",\n"

    result += "];"

    return result


file_path = 'ListCountryAttractions.txt'  # Replace with the actual file path
output = process_attractions(file_path)

with open('predictionOutput.txt', 'w') as file:
    file.write(output)


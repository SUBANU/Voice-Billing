from flask import Flask, render_template, jsonify
import speech_recognition as sr
from nltk.tokenize import word_tokenize

app = Flask(__name__, static_url_path='/static', static_folder='js')

def recognize_voice():
    # Initialize recognizer
    recognizer = sr.Recognizer()
    
    # Capture audio from microphone
    with sr.Microphone() as source:
        print("Listening...")
        recognizer.adjust_for_ambient_noise(source)  # Adjust for ambient noise
        audio = recognizer.listen(source)
    
    try:
        # Use Google Speech Recognition to convert audio to text
        recognized_text = recognizer.recognize_google(audio)
        print("You said:", recognized_text)
        return recognized_text
    except sr.UnknownValueError:
        print("Could not understand audio")
        return None
    except sr.RequestError as e:
        print("Could not request results; {0}".format(e))
        return None

def parse_input(input_text):
    tokens = word_tokenize(input_text.lower())  # Tokenize and convert to lowercase
    
    quantity = None
    units = None
    item_name = None
    no_of_items = 1  # Default value for number of items
    
    # Look for numeric values
    for i, token in enumerate(tokens):
        if token.isnumeric():
            quantity = token
            # Check if the next token is a unit
            if i + 1 < len(tokens) and tokens[i + 1] in ['kg', 'g', 'liters', 'pack','kilogram','gram','grams','kilograms']:
                units = tokens[i + 1]
                break
        elif token == 'pack':  # Handle "pack" as a unit
            units = 'pack'
            if i - 1 >= 0 and tokens[i - 1].isnumeric():
                quantity = tokens[i - 1]
            break
    
    # Look for the number of items
    if 'pack' in tokens:
        index = tokens.index('pack')
        if index - 1 >= 0 and tokens[index - 1].isnumeric():
            no_of_items = int(tokens[index - 1])

    # Extract item name
    if quantity:
        item_start_index = tokens.index(quantity) + 1
        if units:
            item_start_index = tokens.index(units) + 1
        item_name = ' '.join(tokens[item_start_index:])
    else:
        item_name = ' '.join(tokens)
    
    return quantity, units, item_name, no_of_items

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/get_values', methods=['GET'])
def get_values():
    input_text = recognize_voice()
    if input_text:
        quantity, units, item_name, no_of_items = parse_input(input_text)
        return jsonify({'quantity': quantity, 'units': units, 'item_name': item_name, 'no_of_items': no_of_items})
    else:
        return jsonify({'error': 'Could not recognize audio'})

if __name__ == "__main__":
    app.run(debug=True)
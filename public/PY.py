
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import tensorflow as tf
import logging

app = Flask(__name__)
CORS(app)

logging.basicConfig(level=logging.DEBUG)

try:
    model_lstm = tf.keras.models.load_model('lstm_model.h5')
    logging.info("Model loaded successfully.")
except Exception as e:
    logging.error(f"Failed to load model: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        logging.debug(f"Received data: {data}")

        recent_data = data['recent_data']
        recent_data = np.array(recent_data).reshape(1, 15, 1)
        logging.debug(f"Reshaped data: {recent_data.shape}")

        prediction = model_lstm.predict(recent_data)
        logging.debug(f"Prediction: {prediction}")

        return jsonify({'prediction': prediction.flatten().tolist()})
    except Exception as e:
        logging.error(f"Error making prediction: {e}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)




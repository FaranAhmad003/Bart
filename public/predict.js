let model;

async function loadModel() {
    model = await tf.loadLayersModel('tfjs_model/model.json'); // Path to your TensorFlow.js model
}

async function predict() {
    const input = document.getElementById('inputData').value.split(',').map(Number);
   
    // Preprocessing: Adjust this based on your model's input requirements
    const tensor = tf.tensor(input, [1, input.length, 1]);

    const prediction = model.predict(tensor);
    prediction.data().then(data => {
        document.getElementById('predictionResult').innerText = `Prediction: ${data[0]}`;
    });
}

// Load the model once the page loads
window.onload = loadModel;
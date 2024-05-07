let model;

async function loadModel() {
    model = await tf.loadLayersModel('tfjs_model/model.json');
}

async function predict() {
    const input = document.getElementById('inputData').value.split(',').map(Number);
    
    // Adjust this based on your model's input requirements
    const tensor = tf.tensor(input, [1, input.length, 1]);

    const prediction = model.predict(tensor);
    const data = await prediction.data();

    // Example recommendation logic
    const threshold = 1.0; // Adjust this based on the actual data
    const recommendation = data[0] > threshold ? 'Invest' : 'Do not Invest';

    document.getElementById('recommendation').innerText = `Prediction: ${data[0]}, Recommendation: ${recommendation}`;
    
    // Update chart
    updateChart([input], [data[0]]);
}

function updateChart(inputs, predictions) {
    const ctx = document.getElementById('predictionChart').getContext('2d');
    
    // Example data for Chart.js
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: inputs.map((_, i) => `Point ${i + 1}`),
            datasets: [{
                label: 'Predicted Value',
                data: predictions,
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                x: { title: { display: true, text: 'Inputs' } },
                y: { title: { display: true, text: 'Predicted Value' } }
            }
        }
    });
}

window.onload = loadModel;


// let model;

// async function loadModel() {
//     model = await tf.loadLayersModel('model.json'); // Path to your TensorFlow.js model
// }

// async function predict() {
//     const input = document.getElementById('inputData').value.split(',').map(Number);
   
//     // Preprocessing: Adjust this based on your model's input requirements
//     const tensor = tf.tensor(input, [1, input.length, 1]);

//     const prediction = model.predict(tensor);
//     prediction.data().then(data => {
//         document.getElementById('predictionResult').innerText = `Prediction: ${data[0]}`;
//     });
// }

// // Load the model once the page loads
// window.onload = loadModel;


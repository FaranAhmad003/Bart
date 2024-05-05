import numpy as np
import matplotlib.pyplot as plt
import pandas as pd
import pandas_datareader as web
import datetime as dt

from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.layers import Dense, Dropout, LSTM
from tensorflow.keras.models import Sequential

crypto_currency = 'BTC'
against_currency='USD'

start = dt.datetime(2012,1,1)
end = dt.datetime(2024,3,9) #can be changed to dt.datetime.today() for real time data but I am hardcoding rightnow

data = web.DataReader(crypto_currency, 'yahoo', start, end)

#print(data.head())
scaler=MinMaxScaler(feature_range=(0,1))
scaled_data=scaler.fit_transform(data['Close'].values.reshape(-1,1))

prediction_days=60
X_train=[]
Y_train=[]

for x in range(prediction_days,len(scaled_data)):
    X_train.append(scaled_data[x-prediction_days:x,0])
    Y_train.append(scaled_data[x,0])

X_train,Y_train=np.array(X_train),np.array(Y_train)
X_train=np.reshape(X_train,(X_train.shape[0],X_train.shape[1],1))    #neural network maybe dont know right now

model=Sequential()
#dealing with sequesntial data to train model (ddroptout layer)


model.add(LSTM(units=50,return_sequences=True,input_shape=(X_train.shape[1],1)))
model.add(Dropout(0.2)) #prevent overfitting
model.add(LSTM(units=50,return_sequences=True)) #tweek these value from 50 to something to get some better results
model.add(Dropout(0.2))
model.add(LSTM(units=50))
model.add(Dropout(0.2))
model.Dense(units=1)#get 1 reuslt

model.compile(optimizer='adam',loss='mean_squared_error')
model.fit(X_train,Y_train,epochs=25 , batch_size=32)
#-----------------Till here the moidel is being trained now we need to implement is the test of this model



#testing the model
test_start=dt.datetime(2020,1,1)
test_end=dt.datetime.now()

test_data=web.DataReader(crypto_currency, 'yahoo', test_start, test_end)
actual_prices=test_data['Close'].values
total_dataset=pd.concat((data['Close'],test_data['Close']),axis = 0)

model_inputs = total_dataset.values[len(total_dataset) - len(test_data) - prediction_days:].values
model_inputs = model_inputs.reshape(-1,1)
model_inputs = scaler.fit_transform(model_inputs)

x_test=[]
for x in range(prediction_days,len(model_inputs)):
    x_test.append(model_inputs[x-prediction_days:x,0])

x_test = np.array(x_test)
x_test = np.reshape(x_test,(x_test.shape[0],x_test.shape[1],1))

plt.plot(actual_prices,color='black',label='Actual Prices')
plt.plot(model.predict(x_test),color='blue',label='Predicted Prices')
plt.title(f'{crypto_currency} price prediction')
plt.xlabel('Time')
plt.ylabel('Price')
plt.legend(loc='upper left')
plt.show()
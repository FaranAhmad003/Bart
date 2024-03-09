import numpy as np
import matplotlib.pyplot as plt
import panda as pd
import panda_datareader as web
import datetime as dt

from sklearn.preprocessing import MinMaxScaler
from tensorflow.keras.layer import Dense, Dropout, LSTM
from tensorflow.keras.models import Sequential

crypto_currency = 'BTC'
against_currency='USD'

start = dt.datetime(2012,1,1)
end = dt.datetime(2024,3,10) #can be changed to dt.datetime.today() for real time data but I am hardcoding rightnow

data = web.DataReader(crypto_currency, 'yahoo', start, end)

#print(data.head())
scaler=MinMaxScaler(feature_range=(0,1))
scaled_data=scaler.fit_transform(data['Close'].values.reshape(-1,1))

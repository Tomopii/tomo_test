import streamlit as st
import numpy as np
from pydse import data
import pandas as pd
import matplotlib.pyplot as plt
import japanize_matplotlib
import statsmodels.api as sm

# 加重移動平均を求める関数


def wma(Passengers):

    weight = np.arange(len(Passengers)) + 1
    wma = np.sum(weight * Passengers) / weight.sum()
    return wma

# 指数移動平均を求める関数


def ema(Passengers, period):
    ema = np.zeros(len(Passengers))
    ema[:] = np.nan  # NaN で一旦初期化
    ema[period-1] = Passengers[:period].mean()  # 最初だけ単純移動平均で算出

    for month in range(period, len(Passengers)):
        ema[month] = ema[month-1] + \
            (Passengers[month] - ema[month-1]) / (period + 1) * 2
    return ema


st.set_page_config(layout="wide")
st.title('身近な統計 補助教材')
st.header("時系列分析ー移動平均")
st.markdown("#")

st.markdown("""
#### - Box&Jenkins(1976)の1949年〜1960年の各月ごとの航空会社の乗客数データを使用して以下の3種類の移動平均を描画してみましょう。
#### - 単純移動平均：遡る期間（ウインドウサイズ）から算出する単純な平均値
#### - 加重移動平均：直近のデータに徐々に比重を置いていく平均値
#### - 指数移動平均：過去のデータの重みを指数関数的に低くしていく平均値
""")
st.markdown("#")
st.markdown("#")
st.sidebar.title('身近な統計 補助教材')
st.sidebar.header("時系列分析ー移動平均")
st.sidebar.markdown("#")
st.sidebar.markdown("""
#### Step1:遡るデータの期間(ウインドウサイズ)をスライドバーで設定してください。
""")
n = st.sidebar.slider('ウインドウサイズ(n):', 1, 50, 5)
st.sidebar.markdown("#")
st.sidebar.markdown("""
#### Step2:それぞれの移動平均の違いを確認してみましょう。
""")
st.sidebar.markdown("#")
st.sidebar.markdown("""
#### Step3:ウインドウサイズの値を変えてグラフを確認してみましょう。
""")
st.markdown("#")
col1, col2 = st.columns(2)
st.markdown("#")
st.markdown("#")
col3, col4 = st.columns(2)

# データの読み込み
df = data.airline_passengers()


with col1:
    st.markdown("""
    #### 乗客数の月ごとの時系列データ
    """)
    fig = plt.figure()
    ax1 = plt.axes()
    ax1.plot(df, label="オリジナルデータ")
    ax1.set_xlabel('日付')
    ax1.set_ylabel('乗客者数')
    ax1.legend(loc='best')
    st.pyplot(fig)

with col2:
    st.markdown("""
    #### 乗客数の時系列データと標準移動平均
    """)
    rolling_mean = df.rolling(n).mean().round(1)
    fig2 = plt.figure()
    ax2 = plt.axes()
    ax2.plot(df, label="オリジナルデータ")
    ax2.plot(rolling_mean, linestyle="dashed", color="red", label="標準移動平均")
    ax2.set_xlabel('日付')
    ax2.set_ylabel('乗客者数')
    ax2.legend(loc='best')
    st.pyplot(fig2)

with col3:
    st.markdown("""
    #### 乗客数の時系列データと加重移動平均
    """)
    weighted_mean = df["Passengers"].rolling(n).apply(wma, raw=True).round(1)
    fig3 = plt.figure()
    ax3 = plt.axes()
    ax3.plot(df, label="オリジナルデータ")
    ax3.plot(weighted_mean, linestyle="dashed", color="blue", label="加重移動平均")
    ax3.set_xlabel('日付')
    ax3.set_ylabel('乗客者数')
    ax3.legend(loc='best')
    st.pyplot(fig3)

with col4:
    st.markdown("""
    #### 乗客数の時系列データと指数移動平均
    """)
    exponential_mean = ema(df["Passengers"], n).round(1)
    fig4 = plt.figure()
    ax4 = plt.axes()
    ax4.plot(df.reset_index()["Month"], df["Passengers"], label="オリジナルデータ")
    ax4.plot(df.reset_index()["Month"], exponential_mean, linestyle="dashed",
             color="green", label="指数移動平均")
    ax4.set_xlabel('日付')
    ax4.set_ylabel('乗客者数')
    ax4.legend(loc='best')
    st.pyplot(fig4)

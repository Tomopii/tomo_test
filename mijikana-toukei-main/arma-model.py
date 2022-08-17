import streamlit as st
import numpy as np
from pydse import data
import matplotlib.pyplot as plt
import japanize_matplotlib
from statsmodels.tsa.statespace.sarimax import SARIMAX
from statsmodels.graphics import tsaplots


st.set_page_config(layout="wide")

# サイドバー画面

st.sidebar.title('身近な統計 補助教材')
st.sidebar.header("時系列分析ー自己回帰移動平均(ARMA)モデル")
st.sidebar.markdown("#")
st.sidebar.markdown("""
#### Step1:ラグ数(p)をスライドバーで設定します。
""")
p = st.sidebar.slider('ラグ数(p):', 1, 35, 5)
st.sidebar.markdown("#")
st.sidebar.markdown("""
#### Step2:次数(q)をスライドバーで設定します。
""")
q = st.sidebar.slider('次数(q):', 1, 35, 5)
st.sidebar.markdown("#")
st.sidebar.markdown("""
#### Step3:作成したモデルの結果を確認しましょう。
""")
st.sidebar.markdown("#")
st.sidebar.markdown("""
#### Step4:残差や偏自己相関、モデルによる予測結果を確認しましょう。
""")
st.markdown("#")
st.sidebar.markdown("#")
st.sidebar.markdown("""
#### Step5:ラグ数(p)と次数(q)の値を変更してみましょう。
""")
st.markdown("#")

st.title('身近な統計 補助教材')
st.header("時系列分析ー自己回帰移動平均（ARMA）モデル")
st.markdown("#")

# メイン画面

st.markdown("""
#### - Box&Jenkins(1976)の1949年〜1960年の各月ごとの航空会社の乗客数データを使用してARMAモデルを作成してみましょう。
#### - 自己回帰移動平均（ARMA）モデル：ARモデルとMAモデルの両方の性質を含んだモデルで、ARモデルにホワイトノイズの残差平均を加えたモデル。
""")
st.markdown("#")
st.markdown("#")

col1, col2 = st.columns(2)
st.markdown("#")
st.markdown("#")
col3, col4 = st.columns(2)
st.markdown("#")
st.markdown("#")
col5, col6 = st.columns(2)

# データの読み込み
df = data.airline_passengers()
model = SARIMAX(df, order=(p, 0, q))
result = model.fit()

# 残差の抽出
res = result.resid


with col1:
    st.markdown("""
    #### 乗客数の月ごとの時系列データ
    """)
    fig, ax1 = plt.subplots()
    ax1.plot(df)
    ax1.set_xlabel('日付')
    ax1.set_ylabel('乗客者数')
    st.pyplot(fig)

with col2:
    st.markdown("""
    #### 自己回帰移動平均モデルの情報
    """)
    st.write(result.summary())

with col3:
    st.markdown("""
    #### 自己回帰移動平均モデルの残差
    """)
    fig2, ax2 = plt.subplots()
    ax2.bar(range(len(res)), res)
    # x 軸のラベルを設定する。
    ax2.set_xlabel("データ番号")
    # y 軸のラベルを設定する。
    ax2.set_ylabel("残差")
    st.pyplot(fig2)

with col4:
    st.markdown("""
    #### 自己回帰移動平均モデルの偏自己相関
    """)
    fig3 = tsaplots.plot_pacf(res)
    st.pyplot(fig3)

with col5:
    st.markdown("""
    #### 自己回帰移動平均モデルの予測結果とオリジナルデータの比較
    """)
    fig4, ax4 = plt.subplots()
    ax4.plot(df.values, label="オリジナルデータ")
    # x 軸のラベルを設定する。
    ax4.plot(result.predict(1, len(df)).values,
             label="自己回帰モデルによる予測", linestyle="dashed", color="red")
    ax4.set_xlabel("データ番号")
    # y 軸のラベルを設定する。
    ax4.set_ylabel("残差")
    ax4.legend(loc='best')
    st.pyplot(fig4)

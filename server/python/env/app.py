
# coding: utf-8

# In[1]:

# Required Imports
from flask import Flask
from flask import request
from flask_cors import CORS
from plotly.subplots import make_subplots
from flask_pymongo import PyMongo
import requests
# import plotly.express as px
import pandas as pd
import chart_studio
import chart_studio.tools as tls
import plotly.graph_objs as go
import chart_studio.plotly as py
import os, sys
import matplotlib
import base64
from matplotlib import cm
import math
from matplotlib import pyplot as plt
import numpy as np
from matplotlib.patches import Circle, Wedge, Rectangle
# py.sign_in('nikhile' ,'OkrregXQ8kgWtuZEcuOI')
# py.sign_in('aditya2019','O1AXV3C7JqJm5D2egggr')
py.sign_in('ittigupta05','3rdgZUfOzlVuGQcNeefv')


# In[ ]:

# Establishing connection with MongoDB with specified database
app = Flask(__name__)
CORS(app)
app.config['MONGO_URI'] ="mongodb+srv://headstrait_1:headstrait_1@cluster0-lxitk.mongodb.net/stockbazaar?retryWrites=true&w=majority"
mongo = PyMongo(app)
# Specifying the collection name
collection = mongo.db.stocks_data_2

# Plotting OHLC graph for indices
@app.route("/ohlcindices/<ticker_id>",methods=["GET"])
def ohlc_indices(ticker_id):
    print(ticker_id)
#     Fetching the indices name and projecting ticker_dates
    indices = pd.DataFrame(list(collection.find({"ticker_id":int(ticker_id)},{"ticker_dates"})))
    dates=[]
    open=[]
    high=[]
    low=[]
    close=[]
    volume=[]
#     Looping through the result to fetch the dates and their corresponding values
    for val in indices['ticker_dates'][0]:
        dates.append(val['date'])
        open.append(val["opening"])
        high.append(val["high"])
        low.append(val["low"])
        close.append(val["closing"])
        volume.append(val["volume"])
#     Creating a new DataFrame containing required data
    indexDate = pd.DataFrame({"date":dates,"open":open,"close":close,"low":low,"high":high,"volume":volume})
#     Plotting the graph with Rnage Slector and Range SLider
    layout = dict(
        yaxis=dict(showgrid=False,title="Prices",showline=True, linewidth=1, linecolor='#cacaca'),
    xaxis=dict(
        rangeselector=dict(
            buttons=list([
                dict(count=1,
                     label="1m",
                     step="month",
                     stepmode="backward"),
                dict(count=6,
                     label="6m",
                     step="month",
                     stepmode="backward"),
                dict(count=1,
                     label="YTD",
                     step="year",
                     stepmode="todate"),
                dict(count=1,
                     label="1y",
                     step="year",
                     stepmode="backward"),
                dict(step="all")
            ]),activecolor="#39abf7",x=0.11,xanchor="left",y=1.1,yanchor="top"
        ),
        rangeslider=dict(
            visible = True
        ),
        type='date',showgrid=False,title="Date",showline=True, linewidth=1, linecolor='#cacaca'
    ),    paper_bgcolor='#fafafa',    
    plot_bgcolor='#fafafa'
    )

    fig=go.Figure(data=go.Ohlc(x=indexDate['date'],
                    open=indexDate['open'],
                    high=indexDate['high'],
                    low=indexDate['low'],
                    close=indexDate['close']),layout=layout)
    url=py.plot(fig)
    print(url)
    return (url)


@app.route("/shareprice/<ticker1>/<ticker2>",methods=["GET"])
def stock_chart(ticker1,ticker2):
    company = pd.DataFrame(list(collection.find({"ticker_id":int(ticker1)},{"ticker_dates"})))
    company1 = pd.DataFrame(list(collection.find({"ticker_name":ticker2},{"ticker_dates"})))
    stockDate=[]
    stockDate1=[]
    stockPrice=[]
    stockPrice1=[]
#     Looping through result to fetch dates and get their repective values
    for val in company['ticker_dates'][0]:
        stockDate.append(val['date'])
#     Append the value of Share Price if present , otherwise append '-'
        if ('Share Price' in val):
            stockPrice.append(val['Share Price'])
        else:
             stockPrice.append("-")
            
    for val in company1['ticker_dates'][0]:
        stockDate1.append(val['date'])
#     Append the value of Share Price if present , otherwise append '-'
        if ('Share Price' in val):
            stockPrice1.append(val['Share Price'])
        else:
             stockPrice1.append("-")
# Appending into final dataframe to plot the graph
    sharePrice = pd.DataFrame({"date":stockDate,"sharePrice":stockPrice})
    sharePrice1 = pd.DataFrame({"date":stockDate1,"sharePrice1":stockPrice1})
    trace2= go.Scatter(
        x= sharePrice['date'],
        y= sharePrice['sharePrice'],text='Share Price'
    , marker= dict(size=2,
                    color='#ff4d4d'
                   ),name=ticker1)
    
    trace1= go.Scatter(
        x= sharePrice1['date'],
        y= sharePrice1['sharePrice1'],text='Share Price'
    , marker= dict(size=2,
                    color='#27ae60'
                   ),name=ticker2)

    layout=dict(
    title= 'Stock Chart',xaxis=dict(showgrid=False,title="Date", rangeselector=dict(
            buttons=list([
                dict(count=1,
                     label="1d",
                     step="day",
                     stepmode="backward"),
                dict(count=7,
                     label="1w",
                     step="day",
                     stepmode="backward"),
                dict(count=1,
                     label="1m",
                     step="month",
                     stepmode="backward"),
                 dict(count=3,
                     label="3m",
                     step="month",
                     stepmode="backward"),
                dict(count=6,
                     label="6m",
                     step="month",
                     stepmode="backward"),
                dict(count=1,
                     label="YTD",
                     step="year",
                     stepmode="todate"),
                dict(count=1,
                     label="1y",
                     step="year",
                     stepmode="backward"),
                dict(count=5,
                     label="5y",
                     step="year",
                     stepmode="backward"),
                dict(step="all")
            ]),activecolor="#ff6e85",
            x=0.11,
            xanchor="left",
            y=1.1,
            yanchor="top"
        ),showline=True, linewidth=1, linecolor='#707070'),yaxis=dict(showgrid=False,title="Share Price",showline=True, linewidth=2, linecolor='#707070'),
    paper_bgcolor='rgba(0,0,0,0)',    
    plot_bgcolor='rgba(0,0,0,0)'
    
    )

    data = [trace2,trace1]
    fig = dict(data=data,layout=layout)
    url=py.plot(fig)
    print(url)
    return(url)


# Company OHLC Graph
@app.route("/companyindices/<ticker_name>",methods=['GET'])
def compnay_indices(ticker_name):
    companyohlc = pd.DataFrame(list(collection.find({"ticker_name":ticker_name},{"ohlc_dates"})))
    companydates=[]
    companyopen=[]
    companyhigh=[]
    companylow=[]
    companyclose=[]
    companyvolume=[]
    companydata=[]


    for val in companyohlc['ohlc_dates'][0]:
        companydates.append(val['date'])
        if ('opening' in val) :
            companyopen.append(val["opening"])
        else:
            companyopen.append('-')
        if ('high' in val) :
            companyhigh.append(val["high"])
        else:
            companyhigh.append('-')
        if ('low' in val) :
            companylow.append(val["low"])
        else:
            companylow.append('-')
        if ('closing' in val) :
            companyclose.append(val["closing"])
        else:
            companyclose.append('-')
        if ('volume' in val) :
            companyvolume.append(val["volume"])
        else:
            companyvolume.append('-')
    companyDate = pd.DataFrame({"date":companydates,"open":companyopen,"close":companyclose,"low":companylow,"high":companyhigh,"volume":companyvolume})
    layout = dict(
    title='Stock Chart',
        yaxis=dict(showgrid=False,title="Prices"),
    xaxis=dict(
        rangeselector=dict(
            buttons=list([
                dict(count=1,
                     label="1m",
                     step="month",
                     stepmode="backward"),
                dict(count=6,
                     label="6m",
                     step="month",
                     stepmode="backward"),
                dict(count=1,
                     label="YTD",
                     step="year",
                     stepmode="todate"),
                dict(count=1,
                     label="1y",
                     step="year",
                     stepmode="backward"),
                dict(step="all")
            ])
        ),
        rangeslider=dict(
            visible = True
        ),
        type='date',showgrid=False,title="Date"
    )
    )

    fig=go.Figure(data=go.Ohlc(x=companyDate['date'],
                    open=companyDate['open'],
                    high=companyDate['high'],
                    low=companyDate['low'],
                    close=companyDate['close']),layout=layout)
    url=py.plot(fig)
    print(url)
    return(url)

# Comparison between Two comapnies (Monte Carlo Prediction)
@app.route("/monteCarloCompany1/<ticker1>",methods=["GET"])
def monte_carlo(ticker1):
    response = requests.get("https://headstocksmontecarlobhavana.herokuapp.com//api/stocks/predict/"+ticker1)
    monteCarlo = pd.DataFrame();
    monteCarlo=response.json();
    sliced_arr=[]
    sliced_arr1=[]
    sliced_arr2=[]
    sliced_arr3=[]
    sliced_arr4=[]
    sliced_arr5=[]
    sliced_arr6=[]
    sliced_arr7=[]
    sliced_arr8=[]
    sliced_arr9=[]
    sliced_arr = monteCarlo[0:9]
    sliced_arr1= monteCarlo[10:19]
    sliced_arr2= monteCarlo[20:29]
    sliced_arr3 = monteCarlo[30:39]
    sliced_arr4= monteCarlo[40:49]
    sliced_arr5= monteCarlo[50:59]
    sliced_arr6 = monteCarlo[60:69]
    sliced_arr7= monteCarlo[70:79]
    sliced_arr8= monteCarlo[80:89]
    sliced_arr9 = monteCarlo[90:99]
    fig = go.Figure()
    fig.add_trace(go.Scatter( y=sliced_arr,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr1,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr2,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr3,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr4,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr5,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr6,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr7,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr8,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr9, mode='lines+markers'))
    fig.update_xaxes(showgrid=False, zeroline=False)
    fig.update_yaxes(showgrid=False, zeroline=False)
    fig.update_layout(showlegend=False)
    url=py.plot(fig)
    print(url)
    return(url)

@app.route("/monteCarloCompany2/<ticker1>",methods=["GET"])
def monte_carlo1(ticker1):
    response = requests.get("https://headstocksmontecarlobhavana.herokuapp.com/api/stocks/predict/"+ticker1)
    monteCarlo=pd.DataFrame();
    monteCarlo=response.json();
    sliced_arr=[]
    sliced_arr1=[]
    sliced_arr2=[]
    sliced_arr3=[]
    sliced_arr4=[]
    sliced_arr5=[]
    sliced_arr6=[]
    sliced_arr7=[]
    sliced_arr8=[]
    sliced_arr9=[]
    sliced_arr = monteCarlo[0:9]
    sliced_arr1= monteCarlo[10:19]
    sliced_arr2= monteCarlo[20:29]
    sliced_arr3 = monteCarlo[30:39]
    sliced_arr4= monteCarlo[40:49]
    sliced_arr5= monteCarlo[50:59]
    sliced_arr6 = monteCarlo[60:69]
    sliced_arr7= monteCarlo[70:79]
    sliced_arr8= monteCarlo[80:89]
    sliced_arr9 = monteCarlo[90:99]
    fig = go.Figure()
    fig.add_trace(go.Scatter( y=sliced_arr,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr1,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr2,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr3,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr4,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr5,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr6,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr7,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr8,mode='lines+markers'))
    fig.add_trace(go.Scatter( y=sliced_arr9, mode='lines+markers'))
    fig.update_xaxes(showgrid=False, zeroline=False)
    fig.update_yaxes(showgrid=False, zeroline=False)
    fig.update_layout(showlegend=False)
    url=py.plot(fig)
    print(url)
    return(url)
    

# Comparison for Assests and Liabilities Graph of two Companies
@app.route("/assetsCompany1/<ticker>",methods=["GET"])
def assets_Liabilities(ticker):
    currentAssets=[]
    receivables=[]
    ppe=[]
    totalassets=[]
    currentliabilities=[]
    longTerm=[]
    noncurrent=[]
    equity=[]
    indices = pd.DataFrame(list(collection.find({"ticker_id":int(ticker)},{"ticker_dates"})))
    for val in indices['ticker_dates'][0]:
        if('Current Assets' in val):
            currentAssets.append(val['Current Assets'])
        if('Receivables' in val):
            receivables.append(val['Receivables'])
        if('Net PP&E' in val):
            ppe.append(val['Net PP&E'])
        if('Total Assets' in val):
            totalassets.append(val['Total Assets'])
        if('Current Liabilities' in val):
            currentliabilities.append(val['Current Liabilities'])
        if('Long Term Debt' in val):
            longTerm.append(val['Long Term Debt'])
        if('Total Noncurrent Liabilities' in val):
            noncurrent.append(val['Total Noncurrent Liabilities'])
        if('Total Equity' in val):
            equity.append(val['Total Equity'])

    otherlongterm = noncurrent[-1] - longTerm[-1]     
    longassets = totalassets[-1] - currentAssets[-1] - ppe[-1] - receivables[-1]
    labels = ['Current Assets','Net PP&E','Receiavbles','Long Term Assets']
    values = [currentAssets[-1], ppe[-1], receivables[-1], longassets]

    labels1 = ['Current Liabilities','long term debt','Total Noncurrent Liabilities','Other Long Term Liabilities','Total Equity']
    values1 = [currentliabilities[-1], longTerm[-1], noncurrent[-1], otherlongterm,equity[-1]]
    # Create subplots: use 'domain' type for Pie subplot
    fig = make_subplots(rows=1, cols=2, specs=[[{'type':'domain'}, {'type':'domain'}]])
    fig.add_trace(go.Pie(labels=labels, values=values, name=""), 1, 1)
    fig.add_trace(go.Pie(labels=labels1, values=values1, name=""), 1, 2)
    fig.update_traces(hole=.5, hoverinfo="label+percent+name")
    fig.update_layout(showlegend=False,
        title_text="Assets to Liabilities",
        annotations=[dict(text='Total Assets', x=0.18, y=0.5, font_size=12, showarrow=False),
                     dict(text='Total Liabilities', x=0.85, y=0.5, font_size=12, showarrow=False)])
    fig.show(config={
    'scrollZoom': False,
    'displayModeBar': False,
    'editable': False})
    url = py.plot(fig)  
    return(url)

@app.route("/assetsCompany2/<ticker>",methods=["GET"])
def assets_Liabilities1(ticker):
    currentAssets=[]
    receivables=[]
    ppe=[]
    totalassets=[]
    currentliabilities=[]
    longTerm=[]
    noncurrent=[]
    equity=[]
    indices = pd.DataFrame(list(collection.find({"ticker_name":ticker},{"ticker_dates"})))
    for val in indices['ticker_dates'][0]:
        if('Current Assets' in val):
            currentAssets.append(val['Current Assets'])
        if('Receivables' in val):
            receivables.append(val['Receivables'])
        if('Net PP&E' in val):
            ppe.append(val['Net PP&E'])
        if('Total Assets' in val):
            totalassets.append(val['Total Assets'])
        if('Current Liabilities' in val):
            currentliabilities.append(val['Current Liabilities'])
        if('Long Term Debt' in val):
            longTerm.append(val['Long Term Debt'])
        if('Total Noncurrent Liabilities' in val):
            noncurrent.append(val['Total Noncurrent Liabilities'])
        if('Total Equity' in val):
            equity.append(val['Total Equity'])

    otherlongterm = noncurrent[-1] - longTerm[-1]     
    longassets = totalassets[-1] - currentAssets[-1] - ppe[-1] - receivables[-1]
    labels = ['Current Assets','Net PP&E','Receiavbles','Long Term Assets']
    values = [currentAssets[-1], ppe[-1], receivables[-1], longassets]

    labels1 = ['Current Liabilities','long term debt','Total Noncurrent Liabilities','Other Long Term Liabilities','Total Equity']
    values1 = [currentliabilities[-1], longTerm[-1], noncurrent[-1], otherlongterm,equity[-1]]
    # Create subplots: use 'domain' type for Pie subplot
    fig = make_subplots(rows=1, cols=2, specs=[[{'type':'domain'}, {'type':'domain'}]])
    fig.add_trace(go.Pie(labels=labels, values=values, name=""), 1, 1)
    fig.add_trace(go.Pie(labels=labels1, values=values1, name=""), 1, 2)
    fig.update_traces(hole=.5, hoverinfo="label+percent+name")
    fig.update_layout(showlegend=False,
        title_text="Selected Ticker Assets to Liabilities",
        annotations=[dict(text='Total Assets', x=0.18, y=0.5, font_size=12, showarrow=False),
                     dict(text='Total Liabilities', x=0.85, y=0.5, font_size=12, showarrow=False)])
    url=py.plot(fig)
    print(url)
    return (url)


# Recommendations Graph for Comparison fro both companies
@app.route("/gaugeCompany1/<ticker>",methods=["GET"])
def gaugeCompany1(ticker):
    netProfit=[]
    dividend=[]
    commonShares=[]
    equity=[]
    ROE=[]
    ROA=[]
    SharePrice=[]
    liabilities=[]
    cashFlow=[]
    points = 0
    indices = pd.DataFrame(list(collection.find({"ticker_id":int(ticker)},{"ticker_dates"})))
    for val in indices['ticker_dates'][0]:
        if('Net Profit' in val):
            netProfit.append(val['Net Profit'])
        if('Dividends' in val):
            dividend.append(val['Dividends'])
        if('Common Shares Outstanding' in val):
            commonShares.append(val['Common Shares Outstanding'])
        if('Share Price' in val):
            SharePrice.append(val['Share Price'])
        if('Total Liabilities' in val):
            liabilities.append(val['Total Liabilities'])
        if('Total Equity' in val):
            equity.append(val['Total Equity'])
        if('Return on Equity' in val):
            ROE.append(val['Return on Equity'])
        if('Return on Assets' in val):
            ROA.append(val['Return on Assets'])
        if('Cash From Operating Activities' in val):
            cashFlow.append(val['Cash From Operating Activities'])  
    eps=(netProfit[-1]-dividend[-1])/commonShares[-1]
    pne=SharePrice[-1]/eps
    debtToEquity=liabilities[-1]/equity[-1]

    if(pne < 50000 and pne > 10000):
        points += 0.33
    elif (pne > 100000):
        points += 0.99
    elif(pne>50000 and pne <100000 ):
        points += 0.66
    else:
        points+=0

    if(ROA[-1] > 0.02):
        points+=1
    elif(ROA[-1] > 0 and ROA[-1]<0.05):
        points+=0.5

    if(ROE[-1] > 0.05):
        points+=1
    elif(ROE[-1] > 0 and ROE[-1]<0.05):
        points+=0.5

    if(debtToEquity < 1):
        points+=1
    elif(debtToEquity > 1 and debtToEquity<3):
        points+=0.5

    if(cashFlow[-1] > 3000):
        points+=1
    elif(cashFlow[-1] > 1000 and cashFlow[-1]<3000):
        points+=0.5

    if(points < 1.5 or points < 2.5 or points < 3.5 or points < 4.5):
        points = math.floor(points)
    else:
        points  =math.ceil(points)
    fig=gauge(labels=['Strong Sell','Sell','Neutral','Buy','Strong Buy'],       colors=['#ff4d4d','#FF9A9A','#cacaca','#83CAFA','#39abf7'], arrow=points) 
    plt.savefig("gauge.png")
    with open("gauge.png", "rb") as imageFile:
        str = base64.b64encode(imageFile.read())
        print(str)
    return(str)

def degree_range(n): 
    start = np.linspace(0,180,n+1, endpoint=True)[0:-1]
    end = np.linspace(0,180,n+1, endpoint=True)[1::]
    mid_points = start + ((end-start)/2.)
    return np.c_[start, end], mid_points

def rot_text(ang): 
    rotation = np.degrees(np.radians(ang) * np.pi / np.pi - np.radians(90))
    return rotation

def gauge(labels=['LOW','MEDIUM','HIGH','VERY HIGH','EXTREME'],           colors='jet_r', arrow=1, title='', fname=False): 
    N = len(labels)
    if arrow > N: 
        raise Exception("\n\nThe category ({}) is greated than         the length\nof the labels ({})".format(arrow, N))
    if isinstance(colors, str):
        cmap = cm.get_cmap(colors, N)
        cmap = cmap(np.arange(N))
        colors = cmap[::-1,:].tolist()
    if isinstance(colors, list): 
        if len(colors) == N:
            colors = colors[::-1]
        else: 
            raise Exception("\n\nnumber of colors {} not equal             to number of categories{}\n".format(len(colors), N))
    fig, ax = plt.subplots()

    ang_range, mid_points = degree_range(N)

    labels = labels[::-1]
    patches = []
    for ang, c in zip(ang_range, colors): 
        # sectors
        patches.append(Wedge((0.,0.), .4, *ang, facecolor='w', lw=2))
        # arcs
        patches.append(Wedge((0.,0.), .4, *ang, width=0.01, facecolor=c, lw=2, alpha=0.5))
    
    [ax.add_patch(p) for p in patches]
    for mid, lab in zip(mid_points, labels): 

        ax.text(0.35 * np.cos(np.radians(mid)), 0.35 * np.sin(np.radians(mid)), lab,             horizontalalignment='center', verticalalignment='center', fontsize=10, 
             rotation = rot_text(mid))
    r = Rectangle((-0.4,-0.1),0.8,0.1, facecolor='w', lw=2)
    ax.add_patch(r)
    
    ax.text(0, -0.05, title, horizontalalignment='center',          verticalalignment='center', fontsize=14)
    pos = mid_points[abs(arrow - N)]
    ax.arrow(0, 0, 0.225 * np.cos(np.radians(pos)), 0.225 * np.sin(np.radians(pos)),                  width=0.01, head_width=0.01, head_length=0.08, fc='k', ec='k')
    
    ax.add_patch(Circle((0, 0), radius=0.01, facecolor='k'))
    ax.add_patch(Circle((0, 0), radius=0.01, facecolor='w', zorder=1))
    ax.set_frame_on(False)
    ax.axes.set_xticks([])
    ax.axes.set_yticks([])
    ax.axis('equal')
    plt.tight_layout()
    if fname:
        fig.savefig(fname, dpi=200)
        

@app.route("/gaugeCompany2/<ticker>",methods=["GET"])
def gaugeCompany2(ticker):
    netProfit=[]
    dividend=[]
    commonShares=[]
    equity=[]
    ROE=[]
    ROA=[]
    SharePrice=[]
    liabilities=[]
    cashFlow=[]
    points = 0
    indices = pd.DataFrame(list(collection.find({"ticker_name":ticker},{"ticker_dates"})))
    for val in indices['ticker_dates'][0]:
        if('Net Profit' in val):
            netProfit.append(val['Net Profit'])
        if('Dividends' in val):
            dividend.append(val['Dividends'])
        if('Common Shares Outstanding' in val):
            commonShares.append(val['Common Shares Outstanding'])
        if('Share Price' in val):
            SharePrice.append(val['Share Price'])
        if('Total Liabilities' in val):
            liabilities.append(val['Total Liabilities'])
        if('Total Equity' in val):
            equity.append(val['Total Equity'])
        if('Return on Equity' in val):
            ROE.append(val['Return on Equity'])
        if('Return on Assets' in val):
            ROA.append(val['Return on Assets'])
        if('Cash From Operating Activities' in val):
            cashFlow.append(val['Cash From Operating Activities'])  
    eps=(netProfit[-1]-dividend[-1])/commonShares[-1]
    pne=SharePrice[-1]/eps
    debtToEquity=liabilities[-1]/equity[-1]

    if(pne < 50000 and pne > 10000):
        points += 0.33
    elif (pne > 100000):
        points += 0.99
    elif(pne>50000 and pne <100000 ):
        points += 0.66
    else:
        points+=0

    if(ROA[-1] > 0.02):
        points+=1
    elif(ROA[-1] > 0 and ROA[-1]<0.05):
        points+=0.5

    if(ROE[-1] > 0.05):
        points+=1
    elif(ROE[-1] > 0 and ROE[-1]<0.05):
        points+=0.5

    if(debtToEquity < 1):
        points+=1
    elif(debtToEquity > 1 and debtToEquity<3):
        points+=0.5

    if(cashFlow[-1] > 3000):
        points+=1
    elif(cashFlow[-1] > 1000 and cashFlow[-1]<3000):
        points+=0.5

    if(points < 1.5 or points < 2.5 or points < 3.5 or points < 4.5):
        points = math.floor(points)
    else:
        points  =math.ceil(points)
    fig=gauge(labels=['Strong Sell','Sell','Neutral','Buy','Strong Buy'],       colors=['#ff4d4d','#FF9A9A','#cacaca','#83CAFA','#39abf7'], arrow=points) 
    plt.savefig("gauge.png")
    with open("gauge.png", "rb") as imageFile:
        str = base64.b64encode(imageFile.read())
        print(ticker)
    return(str)

def degree_range(n): 
    start = np.linspace(0,180,n+1, endpoint=True)[0:-1]
    end = np.linspace(0,180,n+1, endpoint=True)[1::]
    mid_points = start + ((end-start)/2.)
    return np.c_[start, end], mid_points

def rot_text(ang): 
    rotation = np.degrees(np.radians(ang) * np.pi / np.pi - np.radians(90))
    return rotation

def gauge(labels=['LOW','MEDIUM','HIGH','VERY HIGH','EXTREME'],           colors='jet_r', arrow=1, title='', fname=False): 
    N = len(labels)
    if arrow > N: 
        raise Exception("\n\nThe category ({}) is greated than         the length\nof the labels ({})".format(arrow, N))
    if isinstance(colors, str):
        cmap = cm.get_cmap(colors, N)
        cmap = cmap(np.arange(N))
        colors = cmap[::-1,:].tolist()
    if isinstance(colors, list): 
        if len(colors) == N:
            colors = colors[::-1]
        else: 
            raise Exception("\n\nnumber of colors {} not equal             to number of categories{}\n".format(len(colors), N))
    fig, ax = plt.subplots()

    ang_range, mid_points = degree_range(N)

    labels = labels[::-1]
    patches = []
    for ang, c in zip(ang_range, colors): 
        # sectors
        patches.append(Wedge((0.,0.), .4, *ang, facecolor='w', lw=2))
        # arcs
        patches.append(Wedge((0.,0.), .4, *ang, width=0.01, facecolor=c, lw=2, alpha=0.5))
    
    [ax.add_patch(p) for p in patches]
    for mid, lab in zip(mid_points, labels): 

        ax.text(0.35 * np.cos(np.radians(mid)), 0.35 * np.sin(np.radians(mid)), lab,             horizontalalignment='center', verticalalignment='center', fontsize=10, 
             rotation = rot_text(mid))
    r = Rectangle((-0.4,-0.1),0.8,0.1, facecolor='w', lw=2)
    ax.add_patch(r)
    
    ax.text(0, -0.05, title, horizontalalignment='center',          verticalalignment='center', fontsize=14)
    pos = mid_points[abs(arrow - N)]
    ax.arrow(0, 0, 0.225 * np.cos(np.radians(pos)), 0.225 * np.sin(np.radians(pos)),                  width=0.01, head_width=0.01, head_length=0.08, fc='k', ec='k')
    
    ax.add_patch(Circle((0, 0), radius=0.01, facecolor='k'))
    ax.add_patch(Circle((0, 0), radius=0.01, facecolor='w', zorder=1))
    ax.set_frame_on(False)
    ax.axes.set_xticks([])
    ax.axes.set_yticks([])
    ax.axis('equal')
    plt.tight_layout()
    if fname:
        fig.savefig(fname, dpi=200)
        
@app.route("/voltality/<ticker>",methods=["GET"])
def  voltality(ticker):
    share=[]
    date=[]
    indices = pd.DataFrame(list(collection.find({"ticker_id":int(ticker)},{"ticker_dates"})))
    for val in indices['ticker_dates'][0]:
        if ('Share Price' in val) :
                share.append(val['Share Price'])
        else:
                share.append(np.nan)

        date.append(val['date'])

    prediction = pd.DataFrame({"date":date,"Share Price":share})
    prediction = prediction.dropna()
    prediction=prediction.reset_index()
    days = (prediction["date"].iloc[-1] - prediction["date"].iloc[0]).days
    print(days)
    cagr = ((((prediction['Share Price'].iloc[-1]) / prediction['Share Price'].iloc[1])) ** (365.0/days)) - 1
    print ('CAGR =',str(round(cagr,4)*100)+"%")
    mu = cagr
    prediction['Returns'] = prediction['Share Price'].pct_change()
    vol = prediction['Returns'].std()*math.sqrt(252)
    volatile=str(round(vol,4)*100)+"%"
    return(volatile)

        
if __name__ == '__main__':
    app.run(debug=False,port=5000)







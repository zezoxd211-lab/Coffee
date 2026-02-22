import sys
import json
import yfinance as yf
import pandas as pd
import numpy as np

def clean_dict(d):
    """Recursively clean dicts for JSON serialization (handles NaNs and NaTs)"""
    if isinstance(d, dict):
        cleaned = {}
        for k, v in d.items():
            key_str = str(k.date()) if hasattr(k, 'date') else str(k)
            cleaned[key_str] = clean_dict(v)
        return cleaned
    elif isinstance(d, pd.Series):
        return clean_dict(d.to_dict())
    elif isinstance(d, float) and (np.isnan(d) or np.isinf(d)):
        return None
    elif isinstance(d, pd.Timestamp) or type(d).__name__ == 'Timestamp':
        return str(d)
    elif pd.isna(d):
        return None
    return d

def get_chart(symbol, range_str, interval_str):
    ticker = yf.Ticker(symbol)
    hist = ticker.history(period=range_str, interval=interval_str, prepost=False, raise_errors=False)
    
    if hist.empty:
        return {"chart": {"result": None, "error": {"description": "No data found for " + symbol}}}
    
    # Fill NANs with None for JSON mapping
    hist = hist.replace({np.nan: None})
    
    timestamps = (hist.index.astype('int64') // 10**9).tolist()
    
    close_prices = hist['Close'].tolist()
    open_prices = hist['Open'].tolist()
    
    current_price = close_prices[-1] if close_prices and close_prices[-1] is not None else 0
    prev_close = close_prices[-2] if len(close_prices) > 1 and close_prices[-2] is not None else open_prices[-1] if open_prices and open_prices[-1] is not None else current_price
    
    if prev_close and prev_close > 0:
        change = current_price - prev_close
        change_pct = (change / prev_close) * 100
    else:
        change = 0
        change_pct = 0
        
    result = {
        "chart": {
            "result": [
                {
                    "meta": {
                        "symbol": symbol,
                        "currency": "SAR",
                        "regularMarketPrice": current_price,
                        "previousClose": prev_close,
                        "chartPreviousClose": prev_close,
                        "regularMarketChange": change,
                        "regularMarketChangePercent": change_pct
                    },
                    "timestamp": timestamps,
                    "indicators": {
                        "quote": [
                            {
                                "open": open_prices,
                                "high": hist['High'].tolist(),
                                "low": hist['Low'].tolist(),
                                "close": close_prices,
                                "volume": hist['Volume'].tolist()
                            }
                        ]
                    }
                }
            ],
            "error": None
        }
    }
    return result

def get_quote(symbol):
    ticker = yf.Ticker(symbol)
    info = ticker.info
    # Wrap in the expected Yahoo API quoteSummary structure
    return {"quoteSummary": {"result": [{"summaryProfile": info, "financialData": info, "defaultKeyStatistics": info}]}}

def get_financials(symbol):
    ticker = yf.Ticker(symbol)
    
    inc = ticker.income_stmt
    bal = ticker.balance_sheet
    cash = ticker.cash_flow
    
    return {
        "incomeStatement": clean_dict(inc.to_dict() if inc is not None else {}),
        "balanceSheet": clean_dict(bal.to_dict() if bal is not None else {}),
        "cashFlow": clean_dict(cash.to_dict() if cash is not None else {})
    }

def main():
    try:
        if len(sys.argv) < 2:
            print(json.dumps({"error": "Missing input JSON argument"}))
            sys.exit(1)
            
        input_data = json.loads(sys.argv[1])
        action = input_data.get('action')
        
        if action == 'chart':
            symbol = input_data.get('symbol')
            range_str = input_data.get('range', '1d')
            interval_str = input_data.get('interval', '1d')
            result = get_chart(symbol, range_str, interval_str)
            print(json.dumps(result))
            
        elif action == 'quote':
            symbol = input_data.get('symbol')
            result = get_quote(symbol)
            print(json.dumps(result))
            
        elif action == 'financials':
            symbol = input_data.get('symbol')
            result = get_financials(symbol)
            print(json.dumps(result))
            
        elif action == 'batch_chart':
            symbols = input_data.get('symbols', [])
            range_str = input_data.get('range', '1d')
            interval_str = input_data.get('interval', '1d')
            
            output = {}
            for sym in symbols:
                output[sym] = get_chart(sym, range_str, interval_str)
                
            print(json.dumps(output))
            
        else:
            print(json.dumps({"error": "Unknown action"}))
            
    except Exception as e:
        import traceback
        print(json.dumps({"error": str(e), "traceback": traceback.format_exc()}))
        sys.exit(1)

if __name__ == "__main__":
    main()

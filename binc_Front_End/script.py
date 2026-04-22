import requests, re

r = requests.get('https://lista.mercadolivre.com.br/capacete', headers={'User-Agent': 'Mozilla/5.0'})
prices = re.findall(r'"price":(\d+(?:\.\d+)?)', r.text)
print(prices[:10])

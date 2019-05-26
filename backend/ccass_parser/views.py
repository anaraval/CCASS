from django.shortcuts import render
from django.http import JsonResponse
import requests
from bs4 import BeautifulSoup
import json
from ccass_parser.models import Parser
import datetime
from django.views.decorators.csrf import csrf_exempt

URL = "http://www.hkexnews.hk/sdw/search/searchsdw.aspx"
participant_mapping = {'C00019': 'HSBC', 'B01490': 'HSBC', 'B01078': 'SC', 'C00039': 'SC', 'C00010': 'CITI',
                       'B01451': 'GS', 'B01323': 'DB', 'C00074': 'DB', 'B01224': 'ML', 'B01554': 'MACQ',
                       'C00102': 'MACQ', 'B01491': 'CS', 'C00100': 'JPM', 'B01504': 'JPM', 'B01110': 'JPM',
                       'B01161': 'UBS', 'B01366': 'UBS', 'B01299': 'BNP', 'C00064': 'BNP', 'C00093': 'BNP',
                       'C00015': 'DBS', 'C00016': 'DBS', 'B01274': 'MS', 'B01138': 'CLSA', 'B01076': 'BARC',
                       'B01781': 'BARC', 'C00005': 'BARC', 'C00098': 'BARC'}

@csrf_exempt
def home(request):
    print ('Request is under process')
    post_data = json.loads(request.body.decode("utf-8").replace("'",'"'))
    startDate = post_data.get('startDate').split('/')
    endDate = post_data.get('endDate').split('/')
    start = datetime.datetime(int(startDate[0]), int(startDate[1]), int(startDate[2]))
    end = datetime.datetime(int(endDate[0]), int(endDate[1]), int(endDate[2]))
    stockTicker = post_data.get('stockTicker')

    delta = end - start
    final_view_data = []
    final_data = {}

    for i in range(delta.days + 1):
        datehere = start + datetime.timedelta(days=i)
        shareholding_date = datehere.strftime("%Y/%m/%d")
        stored_data = Parser.objects.filter(datestring=shareholding_date, stockcode=stockTicker)
        if stored_data:
            for data in stored_data:
                if data.company in final_data.keys():
                    if final_data[data.company].get(shareholding_date, None):
                        final_data[data.company][shareholding_date] = final_data[data.company][shareholding_date] + data.shareholding
                    else:
                        final_data[data.company][shareholding_date] = data.shareholding
                else:
                    final_data[data.company] = {shareholding_date: data.shareholding}
        else:
            with requests.Session() as s:
                s.headers = {"User-Agent": "Mozilla/5.0"}
                res = s.get(URL)
                soup = BeautifulSoup(res.text, "lxml")
                payload = {item['name']: item.get('value', '') for item in soup.select("input[name]")}
                payload['__EVENTTARGET'] = 'btnSearch'
                payload['txtStockCode'] = stockTicker
                payload['txtShareholdingDate'] = shareholding_date
                # payload['txtParticipantID'] = 'A00001'
                req = s.post(URL, data=payload, headers={"User-Agent": "Mozilla/5.0"})
                soup_obj = BeautifulSoup(req.text, "lxml")
                # for items in soup_obj.select("#pnlResultSummary .ccass-search-datarow"):
                #    data = [item.get_text(strip=True) for item in items.select("div")]
                #    print(data)

                table = soup_obj.find('table')
                if not table:
                    continue
                table_body = table.find('tbody')

                rows = table_body.find_all('tr')
                for row in rows:
                    cols = row.find_all('td')
                    participant_id = cols[0].text.split('\n')[2]
                    shareholding = int(cols[3].text.split('\n')[2].replace(',', ''))
                    company = participant_mapping.get(participant_id, None)
                    if company:
                        if company in final_data.keys():
                            if final_data[company].get(shareholding_date, None):
                                final_data[company][shareholding_date] = final_data[company][shareholding_date] + shareholding
                            else:
                                final_data[company][shareholding_date] = shareholding
                        else:
                            final_data[company] = {shareholding_date: shareholding}
                        parse = Parser.objects.create(datestring=shareholding_date,
                                              shareholding=shareholding,
                                              company=company,
                                              stockcode=stockTicker)
                        parse.save()

    for i, j in final_data.items():
        dict1 = {'name': i, 'data': j}
        final_view_data.append(dict1)


    final_json = json.dumps(final_data)
    final_view_json = json.dumps(final_view_data)
    print (final_view_data)
    return JsonResponse(final_view_data, safe=False)
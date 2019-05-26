import datetime
start = datetime.datetime(2008, 8, 15, 0, 0, 0)
end = datetime.datetime(2008, 8, 22, 0, 0, 0)

delta = end - start

for i in range(delta.days + 1):
    print (type(start + datetime.timedelta(days=i)))
    datehere = start + datetime.timedelta(days=i)
    print (start)
    final = datehere.strftime("%Y/%m/%d")
    print (final)
    print (type(final))

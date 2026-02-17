a = set()

for x in range(95):
    aux = (53*x)%95
    print(x, aux)
    if aux in a:
        break
    a.add(aux)
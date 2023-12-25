from matplotlib import pyplot as plt
import networkx as nx

input = open('input.txt', 'r').read().split('\n')

wires = {}
for line in input:
    wire, connections = line.split(': ')
    wires[wire] = connections.split(' ')

map = {}
for wire, connections in wires.items():
    for connection in connections:
        if connection in map:
            map[connection].add(wire)
        else:
            map[connection] = set([wire])

G = nx.Graph()
for wire, connections in wires.items():
    for connection in connections:
        G.add_edge(wire, connection)

nx.draw(G, with_labels=True)
plt.show()
